-- CreateTable
CREATE TABLE "page_views" (
    "id" UUID NOT NULL,
    "path" VARCHAR(500) NOT NULL,
    "post_id" UUID,
    "session_id" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "page_views_post_id_idx" ON "page_views"("post_id");
