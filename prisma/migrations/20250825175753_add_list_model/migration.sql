-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "listId" INTEGER;

-- CreateTable
CREATE TABLE "public"."List" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "boardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_listId_fkey" FOREIGN KEY ("listId") REFERENCES "public"."List"("id") ON DELETE SET NULL ON UPDATE CASCADE;
