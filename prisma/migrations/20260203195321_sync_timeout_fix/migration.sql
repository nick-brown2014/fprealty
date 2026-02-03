-- AlterTable
ALTER TABLE "SyncState" ADD COLUMN     "fullSyncInProgress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fullSyncSkip" INTEGER NOT NULL DEFAULT 0;
