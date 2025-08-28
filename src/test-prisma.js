import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const board = await prisma.board.create({
    data: {
      title: "Sample Board",
    },
  });

  console.log("Board created:", board);

  const task = await prisma.task.create({
    data: {
      title: "Sample Task",
      boardId: board.id,
    },
  });
  console.log("Task created:", task);

  const allBoards = await prisma.board.findMany({
    include: {
      tasks: true,
    },
  });
  console.log("All boards:", allBoards);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });