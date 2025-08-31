-- AlterTable
ALTER TABLE "public"."patients" ADD COLUMN     "convenio" TEXT DEFAULT '',
ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ALTER COLUMN "endereco" SET DEFAULT '';
