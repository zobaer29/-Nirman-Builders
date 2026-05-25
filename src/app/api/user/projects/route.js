import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthPayload } from "@/lib/auth";
import {
  ensureProjectsTable,
  getDefaultProjectImage,
  mapProjectRow,
} from "@/lib/projects";

const PROJECT_TYPES = [
  "Residential",
  "Commercial",
  "Industrial",
  "Infrastructure",
  "Renovation",
];

async function requireUser(request) {
  const payload = await getAuthPayload(request);
  if (!payload) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (Number(payload.roleId) !== 2) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { payload };
}

export async function GET(request) {
  try {
    const auth = await requireUser(request);
    if (auth.error) return auth.error;

    await ensureProjectsTable(pool);

    const [rows] = await pool.query(
      `SELECT id, name, project_type, location, description, budget, status, progress, image_url, created_at
       FROM projects
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [auth.payload.userId]
    );

    const projects = rows.map((row) =>
      mapProjectRow(row, auth.payload.username)
    );

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Fetch user projects error:", error);
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await requireUser(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const name = body.name?.trim();
    const projectType = body.project_type || body.type || "Residential";
    const location = body.location?.trim() || null;
    const description = body.description?.trim() || null;
    const budget =
      body.budget != null && body.budget !== ""
        ? Number(body.budget)
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    if (!PROJECT_TYPES.includes(projectType)) {
      return NextResponse.json(
        { error: "Invalid project type" },
        { status: 400 }
      );
    }

    if (budget != null && (Number.isNaN(budget) || budget < 0)) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    await ensureProjectsTable(pool);

    const imageUrl =
      body.image_url?.trim() || getDefaultProjectImage(projectType);

    const [result] = await pool.query(
      `INSERT INTO projects
        (user_id, name, project_type, location, description, budget, status, progress, image_url)
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', 0, ?)`,
      [
        auth.payload.userId,
        name,
        projectType,
        location,
        description,
        budget,
        imageUrl,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, name, project_type, location, description, budget, status, progress, image_url, created_at
       FROM projects WHERE id = ?`,
      [result.insertId]
    );

    const project = mapProjectRow(rows[0], auth.payload.username);

    return NextResponse.json(
      { message: "Project created successfully", project },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
