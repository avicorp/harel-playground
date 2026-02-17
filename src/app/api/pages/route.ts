import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPage, getPagesByEmail, deletePageByUuid } from "@/lib/pages-db";
import { getGameBySlug, games } from "@/lib/games";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    // If no email provided, try to get from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const pages = getPagesByEmail(session.user.email);
    return NextResponse.json(pages);
  }

  const pages = getPagesByEmail(email);
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { gameSlug, pageName, email } = body;

  if (!gameSlug || !pageName || !email) {
    return NextResponse.json(
      { error: "gameSlug, pageName, and email are required" },
      { status: 400 }
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const game = getGameBySlug(gameSlug);
  if (!game) {
    return NextResponse.json(
      { error: "Game not found", availableGames: games.map((g) => g.slug) },
      { status: 404 }
    );
  }

  const page = createPage(gameSlug, pageName, email);
  return NextResponse.json(page, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uuid } = await request.json();
  if (!uuid) {
    return NextResponse.json({ error: "uuid is required" }, { status: 400 });
  }

  const deleted = deletePageByUuid(uuid, session.user.email);
  if (!deleted) {
    return NextResponse.json(
      { error: "Page not found or not owned by you" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
