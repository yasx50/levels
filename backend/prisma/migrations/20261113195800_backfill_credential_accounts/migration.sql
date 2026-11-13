DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "User" AS first_user
    JOIN "User" AS second_user
      ON first_user."id" < second_user."id"
     AND LOWER(BTRIM(first_user."email")) = LOWER(BTRIM(second_user."email"))
    WHERE first_user."email" IS NOT NULL
      AND second_user."email" IS NOT NULL
  ) THEN
    RAISE EXCEPTION
      'Cannot normalize user emails: duplicate addresses differ only by case or whitespace';
  END IF;
END $$;

UPDATE "User"
SET "email" = LOWER(BTRIM("email"))
WHERE "email" IS NOT NULL;

UPDATE "Account" AS account
SET "password" = "User"."passwordHash"
FROM "User"
WHERE account."userId" = "User"."id"
  AND account."providerId" = 'credential'
  AND account."accountId" = "User"."id"
  AND account."password" IS NULL
  AND "User"."email" IS NOT NULL
  AND "User"."passwordHash" IS NOT NULL;

INSERT INTO "Account" (
  "id",
  "accountId",
  "providerId",
  "userId",
  "password",
  "createdAt",
  "updatedAt"
)
SELECT
  'legacy-credential-' || "User"."id",
  "User"."id",
  'credential',
  "User"."id",
  "User"."passwordHash",
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "User"
WHERE "User"."email" IS NOT NULL
  AND "User"."passwordHash" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "Account" AS account
    WHERE account."userId" = "User"."id"
      AND account."providerId" = 'credential'
      AND account."accountId" = "User"."id"
  );
