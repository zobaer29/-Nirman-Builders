import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable, recalculateProjectProgress, updateMaterialStock } from '@/lib/projects';

export async function GET(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await ensureProjectsTable(pool);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'available_materials') {
      const [mats] = await pool.query('SELECT * FROM materials ORDER BY name ASC');
      return NextResponse.json({ materials: mats }, { status: 200 });
    }

    const [rows] = await pool.query(`
      SELECT mr.*, p.name as project_name
      FROM material_requests mr
      JOIN projects p ON mr.project_id = p.id
      WHERE mr.worker_id = ?
      ORDER BY mr.created_at DESC
    `, [payload.userId]);

    return NextResponse.json({ requests: rows }, { status: 200 });
  } catch (error) {
    console.error('Fetch worker material requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch material requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { projectId, materialName, quantity, unit, urgency, reason } = body;

    if (!projectId || !materialName || !quantity || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await ensureProjectsTable(pool);

    const [result] = await pool.query(`
      INSERT INTO material_requests (project_id, worker_id, material_name, quantity, unit, urgency, reason, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `, [Number(projectId), payload.userId, materialName, Number(quantity), unit, urgency || 'Normal (End of Day)', reason || '']);

    return NextResponse.json({ 
      message: 'Material request submitted successfully',
      requestId: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Submit material request error:', error);
    return NextResponse.json({ error: 'Failed to submit material request' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 4) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { requestId, status } = body;

    if (!requestId || status !== 'Received') {
      return NextResponse.json({ error: 'Invalid parameters. Status must be Received' }, { status: 400 });
    }

    await ensureProjectsTable(pool);

    // Verify ownership and status
    const [reqs] = await pool.query(
      `SELECT mr.*, p.name as project_name 
       FROM material_requests mr
       JOIN projects p ON mr.project_id = p.id
       WHERE mr.id = ?`,
      [Number(requestId)]
    );

    if (reqs.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const reqItem = reqs[0];
    if (Number(reqItem.worker_id) !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this request' }, { status: 403 });
    }

    if (reqItem.status !== 'Approved') {
      return NextResponse.json({ error: 'Only approved requests can be marked as received' }, { status: 400 });
    }

    // Update material stock in database
    await updateMaterialStock(pool, reqItem.material_name, reqItem.quantity, reqItem.project_name);

    // Update status to Received
    await pool.query(
      'UPDATE material_requests SET status = ? WHERE id = ?',
      ['Received', Number(requestId)]
    );

    await pool.query(
      "UPDATE tasks SET status = 'Completed' WHERE material_request_id = ?",
      [Number(requestId)]
    );

    const projectProgress = await recalculateProjectProgress(pool, reqItem.project_id);

    return NextResponse.json({ 
      message: 'Material request marked as received successfully',
      requestId,
      status: 'Received',
      project: projectProgress
    }, { status: 200 });

  } catch (error) {
    console.error('Update worker material request status error:', error);
    return NextResponse.json({ error: 'Failed to update request status' }, { status: 500 });
  }
}
