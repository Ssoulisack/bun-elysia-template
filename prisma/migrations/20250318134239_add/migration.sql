-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "fullname" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
