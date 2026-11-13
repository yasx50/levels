ALTER TABLE "Connection" ADD COLUMN "pairKey" TEXT;

UPDATE "Connection"
SET "pairKey" = LEAST(
                  "requesterId" COLLATE "C",
                  "recipientId" COLLATE "C"
                ) || ':' || GREATEST(
                  "requesterId" COLLATE "C",
                  "recipientId" COLLATE "C"
                );

CREATE UNIQUE INDEX "Connection_pairKey_key" ON "Connection"("pairKey");

ALTER TABLE "Connection" ALTER COLUMN "pairKey" SET NOT NULL;
