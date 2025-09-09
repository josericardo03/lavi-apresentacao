import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar alguns usuários
  const user1 = await prisma.user.create({
    data: {
      email: "admin@exemplo.com",
      password: "senha123", // Senha em texto puro propositalmente
      name: "Administrador",
      role: "admin",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "usuario@exemplo.com",
      password: "abc123", // Senha em texto puro propositalmente
      name: "Usuário Comum",
      role: "user",
    },
  });

  // Criar alguns posts
  await prisma.post.create({
    data: {
      title: "Post Normal",
      content: "Este é um post normal sem conteúdo malicioso.",
      authorId: user1.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Post com XSS",
      content:
        '<script>alert("XSS!");</script><img src="x" onerror="alert(\'XSS via img!\')">',
      authorId: user2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


