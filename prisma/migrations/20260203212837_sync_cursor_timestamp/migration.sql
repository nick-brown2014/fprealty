/*
  Warnings:

  - You are about to drop the column `fullSyncSkip` on the `SyncState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SyncState" DROP COLUMN "fullSyncSkip",
ADD COLUMN     "fullSyncCursor" TIMESTAMP(3);
