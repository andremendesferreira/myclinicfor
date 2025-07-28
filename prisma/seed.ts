import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const activities = [
    // MÉDICOS ESPECIALISTAS
    { name: 'Clínico Geral' },
    { name: 'Cardiologista' },
    { name: 'Hematologista' },
    { name: 'Traumatologista' },
    { name: 'Otorrinolaringologista' },
    { name: 'Psiquiatra' },
    { name: 'Ortopedista' },
    { name: 'Oftalmologista' },
    { name: 'Dermatologista' },
    { name: 'Ginecologista' },
    { name: 'Pediatra' },
    { name: 'Proctologista' },
    { name: 'Neurologista' },
    { name: 'Pneumologista' },
    { name: 'Gastroenterologista' },
    { name: 'Endocrinologista' },
    { name: 'Urologista' },
    { name: 'Oncologista' },
    { name: 'Reumatologista' },
    { name: 'Nefrologista' },
    { name: 'Infectologista' },
    { name: 'Anestesiologista' },
    { name: 'Cirurgião Geral' },
    { name: 'Cirurgião Plástico' },
    { name: 'Cirurgião Vascular' },
    { name: 'Cirurgião Torácico' },
    { name: 'Neurocirurgião' },
    { name: 'Radiologista' },
    { name: 'Patologista' },
    { name: 'Medicina Nuclear' },
    { name: 'Medicina do Trabalho' },
    { name: 'Medicina Legal' },
    { name: 'Medicina de Família' },
    { name: 'Geriatra' },
    { name: 'Neonatologista' },
    { name: 'Intensivista' },
    { name: 'Emergencista' },
    { name: 'Geneticista' },
    { name: 'Fisiatra' },
    { name: 'Mastologista' },
    { name: 'Hepatologista' },
    { name: 'Coloproctologista' },
    { name: 'Medicina do Esporte' },
    { name: 'Homeopata' },
    { name: 'Acupunturista' },

    // ODONTOLOGIA
    { name: 'Dentista/Odontólogo' },
    { name: 'Ortodontista' },
    { name: 'Endodontista' },
    { name: 'Periodontista' },
    { name: 'Cirurgião Bucomaxilofacial' },
    { name: 'Protesista' },
    { name: 'Implantodontista' },
    { name: 'Odontopediatra' },
    { name: 'Dentística' },
    { name: 'Patologia Oral' },

    // ENFERMAGEM
    { name: 'Enfermeiro' },
    { name: 'Técnico em Enfermagem' },
    { name: 'Auxiliar de Enfermagem' },
    { name: 'Enfermeiro do Trabalho' },
    { name: 'Enfermeiro Obstetra' },

    // TERAPIAS E REABILITAÇÃO
    { name: 'Fisioterapeuta' },
    { name: 'Terapeuta Ocupacional' },
    { name: 'Fonoaudiólogo' },
    { name: 'Psicólogo' },
    { name: 'Psicoterapeuta' },
    { name: 'Massoterapeuta' },
    { name: 'Osteopata' },
    { name: 'Quiropraxista' },
    { name: 'Reflexologista' },

    // NUTRIÇÃO E ALIMENTAÇÃO
    { name: 'Nutricionista' },
    { name: 'Técnico em Nutrição' },

    // FARMÁCIA
    { name: 'Farmacêutico' },
    { name: 'Farmacêutico Clínico' },
    { name: 'Farmacêutico Hospitalar' },
    { name: 'Técnico em Farmácia' },

    // DIAGNÓSTICO E ANÁLISES
    { name: 'Biomédico' },
    { name: 'Técnico em Análises Clínicas' },
    { name: 'Técnico em Radiologia' },
    { name: 'Técnico em Ultrassonografia' },
    { name: 'Técnico em Eletrocardiografia' },
    { name: 'Técnico em Eletroencefalografia' },
    { name: 'Perfusionista' },

    // SAÚDE BUCAL
    { name: 'Técnico em Saúde Bucal' },
    { name: 'Auxiliar em Saúde Bucal' },

    // OUTROS PROFISSIONAIS
    { name: 'Assistente Social' },
    { name: 'Educador Físico' },
    { name: 'Biólogo' },
    { name: 'Veterinário (Saúde Pública)' },
    { name: 'Agente Comunitário de Saúde' },
    { name: 'Agente de Combate às Endemias' },
    { name: 'Técnico em Órteses e Próteses' },
    { name: 'Técnico em Instrumentação Cirúrgica' },
    { name: 'Técnico em Hemoterapia' },
    { name: 'Técnico em Histopatologia' },
    { name: 'Técnico em Citologia' },
    { name: 'Técnico em Imobilização Ortopédica' },
    { name: 'Técnico em Necrópsia' },
    { name: 'Técnico em Registros e Informações de Saúde' },
    { name: 'Técnico em Vigilância em Saúde' },
    { name: 'Técnico em Saúde Mental' },
    { name: 'Técnico em Reabilitação de Dependentes Químicos' },

    // SERVIÇOS ESPECIALIZADOS
    { name: 'Imunização/Vacinação' },
    { name: 'Aconselhamento Genético' },
    { name: 'Avaliação Postural' },
    { name: 'Terapia da Fala' },
    { name: 'Arteterapia' },
    { name: 'Musicoterapia' },
    { name: 'Dançaterapia' },
    { name: 'Hipnoterapia' },
    { name: 'Terapia Familiar' },
    { name: 'Psicomotricidade' },
    { name: 'Auriculoterapia' },
    { name: 'Fitoterapia' },
    { name: 'Florais' },
    { name: 'Reiki' },
    { name: 'Shiatsu' },

    // GESTÃO E ADMINISTRAÇÃO
    { name: 'Administrador Hospitalar' },
    { name: 'Gestor de Saúde' },
    { name: 'Auditor em Saúde' },
    { name: 'Epidemiologista' },
    { name: 'Sanitarista' },

    // EMERGÊNCIA E RESGATE
    { name: 'Técnico em Emergências Médicas' },
    { name: 'Socorrista' },
    { name: 'Bombeiro Socorrista' },
    { name: 'Condutor de Ambulância' },

    // APOIO E SUPORTE
    { name: 'Recepcionista de Clínica' },
    { name: 'Auxiliar Administrativo da Saúde' },
    { name: 'Maqueiro' },
    { name: 'Copeiro Hospitalar' },
    { name: 'Auxiliar de Limpeza Hospitalar' },
    { name: 'Segurança Hospitalar' }
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