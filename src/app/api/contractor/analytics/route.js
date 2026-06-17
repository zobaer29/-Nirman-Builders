import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (Number(payload.roleId) !== 3) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await ensureProjectsTable(pool);

    // 1. Weekly Data from completed tasks.
    const [weeklyTasks] = await pool.query(`
      SELECT 
        DAYNAME(t.updated_at) as day_name,
        COUNT(*) as count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.contractor_id = ? 
        AND t.status = 'Completed'
        AND t.updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DAYNAME(t.updated_at)
    `, [payload.userId]);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dbDays = {
      'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed', 
      'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat', 'Sunday': 'Sun'
    };
    
    let weeklyData = days.map(d => ({ day: d, tasks: 0, hours: 0 }));
    weeklyTasks.forEach(row => {
      const shortDay = dbDays[row.day_name];
      const dayObj = weeklyData.find(d => d.day === shortDay);
      if (dayObj) {
        dayObj.tasks = row.count;
        dayObj.hours = row.count * 4; 
      }
    });

    // 2. Project Health
    const [projects] = await pool.query(`
      SELECT id, name, progress, status
      FROM projects
      WHERE contractor_id = ? AND status IN ('Ongoing', 'Pending')
      ORDER BY updated_at DESC
    `, [payload.userId]);

    const projectHealth = projects.map(p => {
      let risk = 'Low';
      let onTime = true;
      if (p.progress < 20 && p.status === 'Ongoing') {
        risk = 'High';
        onTime = false;
      } else if (p.progress < 50 && p.status === 'Ongoing') {
        risk = 'Medium';
      }
      return {
        id: p.id,
        name: p.name,
        progress: p.progress,
        onTime,
        risk
      };
    });

    // 3. KPIs
    const [[{ totalProjects }]] = await pool.query('SELECT COUNT(*) as totalProjects FROM projects WHERE contractor_id = ?', [payload.userId]);
    const [[{ tasksCompleted }]] = await pool.query(`
      SELECT COUNT(*) as tasksCompleted 
      FROM tasks t 
      JOIN projects p ON t.project_id = p.id 
      WHERE p.contractor_id = ? AND t.status = 'Completed' AND t.updated_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `, [payload.userId]);

    const [[efficiency]] = await pool.query(`
      SELECT
        AVG(CASE
          WHEN t.status = 'Completed' THEN 100
          WHEN t.status = 'In Progress' THEN 50
          ELSE 0
        END) as taskEfficiency,
        AVG(p.progress) as scheduleAdherence,
        AVG(p.progress) as budgetUtilization
      FROM projects p
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE p.contractor_id = ?
    `, [payload.userId]);

    const [[material]] = await pool.query(`
      SELECT
        AVG(CASE
          WHEN status = 'OK' THEN 100
          WHEN status = 'Low' THEN 50
          ELSE 0
        END) as materialUsage
      FROM materials
    `);

    const [[labour]] = await pool.query(`
      SELECT AVG(pw.attendance) as labourProductivity
      FROM project_workers pw
      JOIN projects p ON pw.project_id = p.id
      WHERE p.contractor_id = ? AND pw.status = 'Active'
    `, [payload.userId]);

    const workflowEfficiency = Math.round(Number(efficiency?.taskEfficiency ?? efficiency?.scheduleAdherence ?? 0));
    const scheduleAdherence = Math.round(Number(efficiency?.scheduleAdherence || 0));
    const budgetUtilization = Math.round(Number(efficiency?.budgetUtilization || 0));
    const materialUsage = Math.round(Number(material?.materialUsage || 0));
    const labourProductivity = Math.round(Number(labour?.labourProductivity || 0));
    
    const delayedProjects = projectHealth.filter(p => !p.onTime).length;

    const kpis = [
      { label: 'Total Projects', value: String(totalProjects || 0), sub: 'All active', icon: 'architecture', bg: 'bg-primary/10', color: 'text-primary' },
      { label: 'Workflow Efficiency', value: `${workflowEfficiency}%`, sub: 'Based on task completion', icon: 'bolt', bg: 'bg-primary/10', color: 'text-[#006a28]' },
      { label: 'Budget Utilization', value: `${budgetUtilization}%`, sub: 'Mapped to project progress', icon: 'payments', bg: 'bg-blue-50', color: 'text-blue-600' },
      { label: 'Tasks Completed', value: String(tasksCompleted || 0), sub: 'This week', icon: 'task_alt', bg: 'bg-purple-50', color: 'text-purple-600' },
      { label: 'Safety Incidents', value: '0', sub: '32-day streak', icon: 'health_and_safety', bg: 'bg-primary/10', color: 'text-[#006a28]' },
      { label: 'Delayed Projects', value: String(delayedProjects), sub: delayedProjects > 0 ? 'Needs attention' : 'All on track', icon: 'warning', bg: 'bg-red-50', color: 'text-red-500' },
    ];

    // 4. Efficiency Rings
    const efficiencyRings = [
      { label: 'Schedule Adherence', value: scheduleAdherence, stroke: '#16a34a' },
      { label: 'Material Usage',     value: materialUsage, stroke: '#60a5fa' },
      { label: 'Labour Productivity',value: labourProductivity, stroke: '#a78bfa' },
    ];

    return NextResponse.json({
      weeklyData,
      projectHealth,
      kpis,
      efficiencyRings
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch contractor analytics error:', error);
    return NextResponse.json({ error: 'Failed to load analytics data' }, { status: 500 });
  }
}
