import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, recalculateProjectProgress } from '@/lib/projects';

export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureProjectsTable(pool);

    const [rows] = await pool.query('SELECT * FROM materials ORDER BY name ASC');

    return NextResponse.json({ materials: rows }, { status: 200 });
  } catch (error) {
    console.error('Fetch contractor material inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch material inventory' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { materialId } = body;

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    await ensureProjectsTable(pool);

    // Get material details
    const [mats] = await pool.query('SELECT * FROM materials WHERE id = ?', [Number(materialId)]);
    if (mats.length === 0) {
      return NextResponse.json({ error: 'Material not found' }, { status: 404 });
    }

    const material = mats[0];

    // Find project ID matching the site name
    const [projs] = await pool.query('SELECT id FROM projects WHERE name = ?', [material.site]);
    let projectId = null;
    let workerId = null;

    if (projs.length > 0) {
      projectId = projs[0].id;
      // Find the first active worker assigned to this project
      const [workers] = await pool.query(
        'SELECT worker_id FROM project_workers WHERE project_id = ? AND status = "Active" LIMIT 1',
        [projectId]
      );
      if (workers.length > 0) {
        workerId = workers[0].worker_id;
      }
    }

    // Default to a fallback project if none matches the site name
    if (!projectId) {
      // Find any project managed by this contractor to assign the task to
      const [contractorProjs] = await pool.query('SELECT id FROM projects WHERE contractor_id = ? LIMIT 1', [payload.userId]);
      if (contractorProjs.length > 0) {
        projectId = contractorProjs[0].id;
        const [workers] = await pool.query(
          'SELECT worker_id FROM project_workers WHERE project_id = ? AND status = "Active" LIMIT 1',
          [projectId]
        );
        if (workers.length > 0) {
          workerId = workers[0].worker_id;
        }
      }
    }

    if (!projectId) {
      return NextResponse.json({ error: 'No projects available to assign the order task' }, { status: 400 });
    }

    const taskTitle = `Verify Order: ${material.name}`;
    const taskDesc = `A supply order has been placed for ${material.name}. Please verify the delivery upon arrival at site: ${material.site || 'Project site'}.`;

    await pool.query(`
      INSERT INTO tasks (project_id, worker_id, title, description, status, priority, due_date)
      VALUES (?, ?, ?, ?, 'Pending', 'Medium', 'Flexible')
    `, [projectId, workerId, taskTitle, taskDesc]);

    await recalculateProjectProgress(pool, projectId);

    return NextResponse.json({ 
      message: 'Order placed and worker task generated successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Place order error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
