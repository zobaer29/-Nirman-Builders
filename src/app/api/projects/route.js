import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureProjectsTable, mapProjectRow } from "@/lib/projects";

async function seedProjectsIfEmpty(pool) {
  try {
    // 1. Check if projects table already has rows
    const [projectCount] = await pool.query("SELECT COUNT(*) as count FROM projects");
    if (projectCount[0].count > 0) {
      return;
    }

    // 2. Get the first user to associate projects with.
    let [users] = await pool.query("SELECT id FROM users LIMIT 1");
    let userId;

    if (users.length === 0) {
      // If no users exist, create a system seed user
      const [userResult] = await pool.query(
        "INSERT INTO users (username, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
        ["SystemSeed", "seed@nirman.com", "$2b$10$dummyhashplaceholderfordevelopmentonly", 2]
      );
      userId = userResult.insertId;
    } else {
      userId = users[0].id;
    }

    // Get a contractor user (role_id = 3) if any, to assign to ongoing/completed projects
    const [contractors] = await pool.query("SELECT id FROM users WHERE role_id = 3 LIMIT 1");
    const contractorId = contractors.length > 0 ? contractors[0].id : null;

    // 3. Define the dummy projects
    const dummyProjects = [
      {
        name: "Skyline Business Tower",
        project_type: "Commercial",
        location: "Banani, Dhaka",
        description: "A 20-floor modern office tower with sustainable design, smart utility management, and premium workspace facilities.",
        budget: 200000000,
        status: "Ongoing",
        progress: 45,
        image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Greenview Residency",
        project_type: "Residential",
        location: "Uttara, Dhaka",
        description: "A family-focused apartment complex featuring landscaped open spaces, rooftop amenities, and earthquake-resistant structure.",
        budget: 85000000,
        status: "Ongoing",
        progress: 75,
        image_url: "https://images.unsplash.com/photo-1600585154340-be6199f7d009?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Metro Shopping Complex",
        project_type: "Commercial",
        location: "Mirpur, Dhaka",
        description: "Retail & lifestyle mall with integrated parking and modern safety features.",
        budget: 150000000,
        status: "Completed",
        progress: 100,
        image_url: "https://images.unsplash.com/photo-1545459720-aac273a27b3d?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Riverfront Villas",
        project_type: "Residential",
        location: "Savar, Dhaka",
        description: "Luxury gated community project with modern duplex villas and clubhouse.",
        budget: 120000000,
        status: "Ongoing",
        progress: 30,
        image_url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Tech Park Phase II",
        project_type: "Industrial",
        location: "Gazipur",
        description: "Industrial and innovation campus with advanced utility infrastructure.",
        budget: 350000000,
        status: "Completed",
        progress: 100,
        image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
      },
      {
        name: "Airport Link Residences",
        project_type: "Residential",
        location: "Khilkhet, Dhaka",
        description: "Transit-friendly high-rise residences with smart security and green zones.",
        budget: 95000000,
        status: "Pending",
        progress: 0,
        image_url: "https://images.unsplash.com/photo-1545459720-aac273a27b3d?q=80&w=2070&auto=format&fit=crop"
      }
    ];

    // 4. Insert dummy projects
    for (const project of dummyProjects) {
      await pool.query(
        `INSERT INTO projects 
          (user_id, name, project_type, location, description, budget, status, progress, image_url, contractor_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          project.name,
          project.project_type,
          project.location,
          project.description,
          project.budget,
          project.status,
          project.progress,
          project.image_url,
          project.status !== "Pending" ? contractorId : null
        ]
      );
    }
    console.log("Successfully seeded 6 projects into the database!");
  } catch (error) {
    console.error("Failed to seed projects:", error);
  }
}

export async function GET(request) {
  try {
    await ensureProjectsTable(pool);
    await seedProjectsIfEmpty(pool);

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

