-- AlterEnum
ALTER TYPE "AdmissionStatus" ADD VALUE 'paid' BEFORE 'contacted';

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'success', 'failed', 'cancelled');

-- AlterTable
ALTER TABLE "AdmissionApplication" ADD COLUMN "admissionFee" INTEGER NOT NULL DEFAULT 500000;
ALTER TABLE "AdmissionApplication" ADD COLUMN "userId" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "issuedStudentId" TEXT;
ALTER TABLE "AdmissionApplication" ADD COLUMN "adminNote" TEXT;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "orderCode" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "transactionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdmissionApplication_userId_key" ON "AdmissionApplication"("userId");
CREATE UNIQUE INDEX "Payment_orderCode_key" ON "Payment"("orderCode");

-- AddForeignKey
ALTER TABLE "AdmissionApplication" ADD CONSTRAINT "AdmissionApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "AdmissionApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
