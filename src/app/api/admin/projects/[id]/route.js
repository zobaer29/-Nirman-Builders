import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getAuthPayload } from '@/lib/auth';
import { ensureProjectsTable } from '@/lib/projects';

export async function PUT(request, { params }) {
  try {
    // 1. Verify token & authorize (Admin only)
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (Number(payload.roleId) !== 1) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const projectId = Number(id);
    if (Number.isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // 2. Parse and validate body
    const body = await request.json();
    const { action, contractorId } = body;

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be accept or reject' }, { status: 400 });
    }

    // Ensure projects table/schema is up to date
    await ensureProjectsTable(pool);

    // 3. Verify project exists
    const [projects] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    let newStatus = '';
    let dbContractorId = null;

    if (action === 'accept') {
      if (!contractorId) {
        return NextResponse.json({ error: 'Contractor ID is required when accepting a project' }, { status: 400 });
      }

      // Verify selected contractor is valid and has contractor role (role_id = 3)
      const [users] = await pool.query('SELECT id, role_id FROM users WHERE id = ?', [contractorId]);
      if (users.length === 0) {
        return NextResponse.json({ error: 'Selected contractor does not exist' }, { status: 400 });
      }

      if (Number(users[0].role_id) !== 3) {
        return NextResponse.json({ error: 'Selected user is not a contractor' }, { status: 400 });
      }

      newStatus = 'Ongoing';
      dbContractorId = Number(contractorId);
    } else {
      newStatus = 'Rejected';
      dbContractorId = null;
    }

    // 4. Update project status and contractor_id
    await pool.query(
      'UPDATE projects SET status = ?, contractor_id = ? WHERE id = ?',
      [newStatus, dbContractorId, projectId]
    );

    return NextResponse.json({ 
      message: `Project ${action}ed successfully`, 
      status: newStatus,
      contractorId: dbContractorId
    }, { status: 200 });

  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  return PUT(request, { params });
}
