import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { completed } = body;

    const todo = await prisma.todo.update({
      where: { id },
      data: { completed },
    });

    return Response.json(todo);
  } catch {
    return Response.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.todo.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
