import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const activities = [
    { name: 'Aconselhamento Genético', active: false },
    { name: 'Acupunturista', active: true },
    { name: 'Arteterapia', active: false },
    { name: 'Auriculoterapia', active: true },
    { name: 'Avaliação Postural', active: false },
    { name: 'Cardiologista', active: true },
    { name: 'Cirurgião Bucomaxilofacial', active: true },
    { name: 'Cirurgião', active: true },
    { name: 'Cirurgião Plástico', active: true },
    { name: 'Cirurgião Torácico', active: false },
    { name: 'Cirurgião Vascular', active: true },
    { name: 'Coloproctologista', active: false },
    { name: 'Dentista/Odontólogo', active: true },
    { name: 'Dermatologista', active: true },
    { name: 'Endocrinologista', active: true },
    { name: 'Endodontista', active: false },
    { name: 'Educador Físico', active: true },
    { name: 'Fisiatra', active: false },
    { name: 'Fisioterapeuta', active: true },
    { name: 'Fitoterapia', active: false },
    { name: 'Florais', active: false },
    { name: 'Fonoaudiólogo', active: true },
    { name: 'Gastroenterologista', active: true },
    { name: 'Geneticista', active: true },
    { name: 'Geriatra', active: true },
    { name: 'Ginecologista', active: true },
    { name: 'Hipnoterapia', active: false },
    { name: 'Hematologista', active: true },
    { name: 'Hepatologista', active: true },
    { name: 'Homeopata', active: false },
    { name: 'Imunização/Vacinação', active: true },
    { name: 'Implantodontista', active: true },
    { name: 'Infectologista', active: true },
    { name: 'Massoterapeuta', active: true },
    { name: 'Mastologista', active: true },
    { name: 'Musicoterapia', active: false },
    { name: 'Neonatologista', active: true },
    { name: 'Nefrologista', active: true },
    { name: 'Neurologista', active: true },
    { name: 'Nutricionista', active: true },
    { name: 'Odontopediatra', active: true },
    { name: 'Oftalmologista', active: true },
    { name: 'Ortopedista', active: true },
    { name: 'Otorrinolaringologista', active: true },
    { name: 'Osteopata', active: true },
    { name: 'Patologista', active: true },
    { name: 'Pediatra', active: true },
    { name: 'Periodontista', active: true },
    { name: 'Proctologista', active: true },
    { name: 'Protesista', active: true },
    { name: 'Psicólogo', active: true },
    { name: 'Psicoterapeuta', active: true },
    { name: 'Psicomotricidade', active: true },
    { name: 'Pneumologista', active: true },
    { name: 'Quiropraxista', active: true },
    { name: 'Reiki', active: true },
    { name: 'Reflexologista', active: true },
    { name: 'Reumatologista', active: true },
    { name: 'Shiatsu', active: true },
    { name: 'Terapeuta Ocupacional', active: true },
    { name: 'Terapia da Fala', active: true },
    { name: 'Terapia Familiar', active: true },
    { name: 'Traumatologista', active: true }
  ];

  console.log(`🔄 Iniciando seed com ${activities.length} profissionais...`);

  let created = 0;
  let skipped = 0;

  for (const activity of activities) {
    try {
      await prisma.activity.create({
        data: activity,
      });
      created++;
      console.log(`✅ Criado: ${activity.name}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Registro já existe - pular silenciosamente
        skipped++;
        console.log(`⏭️  Já existe: ${activity.name}`);
      } else {
        // Outro erro - relançar
        throw error;
      }
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`   ✅ Criados: ${created}`);
  console.log(`   ⏭️  Ignorados: ${skipped}`);
  console.log(`   📝 Total: ${activities.length}`);
  console.log(`\n🎉 Seed finalizado com sucesso!`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });