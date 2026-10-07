import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureProjectsTable, mapProjectRow } from "@/lib/projects";

export async function GET(request) {
  try {
    await ensureProjectsTable(pool);

    // Fetch all projects with client and contractor usernames
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        u_client.username as client_username,
        u_contractor.username as contractor_username
      FROM projects p
      LEFT JOIN users u_client ON p.user_id = u_client.id
      LEFT JOIN users u_contractor ON p.contractor_id = u_contractor.id
      ORDER BY p.created_at DESC
    `);

    const projects = rows.map((row) =>
      mapProjectRow(
        row,
        row.client_username,
        row.contractor_username || null
      )
    );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Fetch public projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

