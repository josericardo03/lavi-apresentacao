import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vulnerabilidade proposital: Não há validação do conteúdo
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content, // Conteúdo não sanitizado
        authorId: 1, // ID fixo para demonstração
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
  }
}


