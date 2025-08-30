-- DropIndex
DROP INDEX "public"."idx_appointments_service_date";

-- DropIndex
DROP INDEX "public"."idx_appointments_user_date";

-- DropIndex
DROP INDEX "public"."idx_subscriptions_plan_status";

-- DropIndex
DROP INDEX "public"."idx_consultations_patient_date";

-- DropIndex
DROP INDEX "public"."idx_consultations_user_status";

-- AlterTable
ALTER TABLE "public"."Appointment" ADD COLUMN     "patientId" TEXT;

-- AlterTable
ALTER TABLE "public"."patients" ADD COLUMN     "endereco" TEXT;

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "public"."Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_cpf_idx" ON "public"."Appointment"("cpf");

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
