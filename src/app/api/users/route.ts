import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sqlite3 from "sqlite3";

const prisma = new PrismaClient();
const db = new sqlite3.Database("./prisma/dev.db");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  // Vulnerabilidade proposital: SQL Injection
  return new Promise((resolve) => {
    // Corrigindo a query SQL para usar a tabela correta do Prisma
    db.all(
      `SELECT * FROM User WHERE name LIKE '%${query}%' OR '${query}'='1'`,
      (err, rows) => {
        if (err) {
          console.error("Erro SQL:", err);
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        } else {
          console.log("Resultados:", rows);
          resolve(NextResponse.json(rows));
        }
      }
    );
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Vulnerabilidade proposital: Senha armazenada sem hash
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password, // Senha em texto puro
        name: body.name,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
