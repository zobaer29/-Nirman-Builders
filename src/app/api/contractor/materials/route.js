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

    const [rows] = await pool.query(`
      SELECT 
        mr.*, 
        p.name as project_name,
        u.username as worker_name
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      JOIN users u ON mr.worker_id = u.id
      WHERE p.contractor_id = ?
      ORDER BY mr.created_at DESC
    `, [payload.userId]);

    return NextResponse.json({ requests: rows }, { status: 200 });
  } catch (error) {
    console.error('Fetch contractor material requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch material requests' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 3) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status } = body;

    const allowedStatuses = ['Approved', 'Rejected'];
    if (!requestId || !status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid parameters. Status must be Approved or Rejected' }, { status: 400 });
    }

    await ensureProjectsTable(pool);

    // Verify this contractor owns the project for this request and get all details
    const [reqs] = await pool.query(`
      SELECT mr.*, p.contractor_id, p.name as project_name 
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      WHERE mr.id = ?
    `, [Number(requestId)]);

    if (reqs.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const requestItem = reqs[0];
    if (Number(requestItem.contractor_id) !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not manage this project' }, { status: 403 });
    }

    // Update status in database
    await pool.query('UPDATE material_requests SET status = ? WHERE id = ?', [status, Number(requestId)]);

    // Automatically create a task for the worker to receive/verify the materials
    if (status === 'Approved') {
      let priority = 'Medium';
      if (requestItem.urgency.toLowerCase().includes('emergency') || requestItem.urgency.toLowerCase().includes('urgent')) {
        priority = 'High';
      }

      const taskTitle = `Receive: ${requestItem.material_name}`;
      const taskDesc = `Verify delivery of ${requestItem.quantity} ${requestItem.unit} of ${requestItem.material_name} at site ${requestItem.project_name}. Reason: ${requestItem.reason || 'Not specified'}`;

      await pool.query(`
        INSERT INTO tasks (project_id, worker_id, title, description, status, priority, due_date, material_request_id)
        VALUES (?, ?, ?, ?, 'Pending', ?, 'Today', ?)
      `, [requestItem.project_id, requestItem.worker_id, taskTitle, taskDesc, priority, requestItem.id]);

      await recalculateProjectProgress(pool, requestItem.project_id);
    }

    return NextResponse.json({ 
      message: `Request status updated to ${status} successfully`,
      requestId,
      status
    }, { status: 200 });
  } catch (error) {
    console.error('Update material request status error:', error);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }
}
