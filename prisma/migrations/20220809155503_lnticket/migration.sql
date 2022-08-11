-- CreateTable
CREATE TABLE "GeneratedK1" (
    "value" TEXT NOT NULL,
    "sid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedK1_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "pubKey" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_pubKey_key" ON "User"("pubKey");
