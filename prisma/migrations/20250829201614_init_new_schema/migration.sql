/*
  Warnings:

  - You are about to drop the column `listId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `List` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_boardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_listId_fkey";

-- AlterTable
ALTER TABLE "public"."Board" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "listId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."TaskStatus" NOT NULL;

-- DropTable
DROP TABLE "public"."List";

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
