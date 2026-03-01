-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "owner_id" UUID NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mimic_pages" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "page_order" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER NOT NULL DEFAULT 1920,
    "height" INTEGER NOT NULL DEFAULT 1080,
    "background_color" VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    "grid_size" INTEGER NOT NULL DEFAULT 20,
    "elements" JSONB NOT NULL DEFAULT '[]',
    "connections" JSONB NOT NULL DEFAULT '[]',
    "is_home_page" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "mimic_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_members" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'VIEWER',
    "assigned_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_members_project_id_user_id_key" ON "project_members"("project_id", "user_id");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mimic_pages" ADD CONSTRAINT "mimic_pages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
