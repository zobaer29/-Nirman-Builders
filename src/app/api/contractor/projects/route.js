import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, mapProjectRow } from '@/lib/projects';

function getNextMilestone(row) {
  const totalTasks = Number(row.total_tasks || 0);
  const completedTasks = Number(row.completed_tasks || 0);

  if (row.status === 'Completed' || (totalTasks > 0 && completedTasks === totalTasks)) {
    return 'All tasks complete';
  }

  if (row.next_task_title) {
    return row.next_task_title;
  }

  if (row.status === 'Pending') {
    return 'Awaiting admin approval';
  }

  return 'Create first task';
}

export async function GET(request) {
  try {
    // 1. Verify token & authorize (Contractor only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ensure database tables are created
    await ensureProjectsTable(pool);

    // 2. Fetch projects assigned to this contractor
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u_client.username as client_username,
        u_client.email as client_email,
        (SELECT COUNT(*) FROM project_workers pw WHERE pw.project_id = p.id AND pw.status = 'Active') as active_labor,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'Completed') as completed_tasks,
        (
          SELECT t.title
          FROM tasks t
          WHERE t.project_id = p.id AND t.status <> 'Completed'
          ORDER BY
            CASE t.status
              WHEN 'In Progress' THEN 1
              WHEN 'Pending' THEN 2
              ELSE 3
            END,
            t.created_at ASC
          LIMIT 1
        ) as next_task_title
      FROM projects p
      LEFT JOIN users u_client ON p.user_id = u_client.id
      WHERE p.contractor_id = ?
      ORDER BY p.created_at DESC
    `, [payload.userId]);

    // 3. Map projects to response format
    const projects = rows.map((row) => {
      const base = mapProjectRow(row, row.client_username, payload.username);
      return {
        ...base,
        labor: Number(row.active_labor || 0),
        nextMilestone: getNextMilestone(row),
      };
    });

    const totalActive = projects.filter((project) => project.status === 'Ongoing').length;
    const completed = projects.filter((project) => project.status === 'Completed').length;
    const delayed = projects.filter((project) => !['Ongoing', 'Completed'].includes(project.status)).length;
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((sum, project) => sum + Number(project.progress || 0), 0) / projects.length)
      : 0;

    return NextResponse.json({
      projects,
      stats: {
        totalActive,
        delayed,
        onSchedule: completed,
        avgProgress,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Fetch contractor projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
