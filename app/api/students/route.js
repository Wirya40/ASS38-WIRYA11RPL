import { NextResponse } from "next/server";

const API_URL = "https://course.summitglobal.id/students";

export async function GET() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    const data = await res.json();

    // The real API wraps data inside "body.data"
    return NextResponse.json(data.body.data || []);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const data = await req.json();
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
  }
}

// ✅ PUT (Update student)
export async function PUT(req) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

// ✅ DELETE (Delete student)
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}