/*
  Warnings:

  - You are about to alter the column `id` on the `Post` table. The data in that column will be cast from `String` to `BigInt`. This cast may fail. Please make sure the data in the column can be cast.
  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_Post" (
    "id" STRING NOT NULL DEFAULT unique_rowid(),
    "text" STRING NOT NULL,
    "views" INT4 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" STRING,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
INSERT INTO "_prisma_new_Post" ("authorId","id","text") SELECT "authorId","id","text" FROM "Post";
DROP TABLE "Post" CASCADE;
ALTER TABLE "_prisma_new_Post" RENAME TO "Post";
