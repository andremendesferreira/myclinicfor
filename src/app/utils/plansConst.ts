export type PlanDetailProps = {
    name: string;
    maxServices: number;
    menuLayout: number;
    description: {
        title: string;
        text: string;
        features: string[];
    };
    price: number;
    activatePromo: boolean;
    promoPrice: number;
}

export type PlansProps = {
    FREE: PlanDetailProps;
    BASIC: PlanDetailProps;
    PREMIUM: PlanDetailProps;
    PROFESSIONAL: PlanDetailProps;
}

export const PLANS: PlansProps = {
  FREE: {
    name: "Grátis",
    maxServices: 2,
    menuLayout: 0,
    description: {
        title: "Plano Gratuito",
        text: "Ideal para quem está começando.",
        features: [
            "Limite de serviço ativo 2",
            "Limite cadastro de serviço 5",
            "Agendamento de consultas",
            "Página de agendamento",
            "Mensagem informativa via WhatsApp",
            "Atualização para planos pagos disponível"
        ]
    },
    price: 4.99,
    activatePromo: true,
    promoPrice: 0.00
  },
  BASIC: {
    name: "Básico",
    maxServices: 5,
    menuLayout: 1,
    description: {
        title: "Plano Básico",
        text: "Perfeito para pequenas clínicas.",
        features: [
            "Limite de serviço ativo 5",
            "Limite cadastro de serviço 10",
            "Agendamento de consultas",
            "Página de agendamento",
            "Contato com suporte",
            "Mensagem informativa via WhatsApp",
            "Atualização para planos pagos disponível"
        ]
    },
    price: 29.99,
    activatePromo: true,
    promoPrice: 24.99
  },
  PROFESSIONAL: {
    name: "Profissional",
    maxServices: 25,
    menuLayout: 2,
    description: {
        title: "Plano Profissional",
        text: "Ótimo para clínicas de médio porte.",
        features: [
            "Limite de serviço ativo 25",
            "Limite cadastro de serviço 30",
            "Agendamento de consultas",
            "Página de agendamento",
            "Registro de consultas",            
            "Personalização de perfil",
            "Gerenciamento de pacientes",                             
            "Contato com suporte",
            "Mensagem informativa via WhatsApp",
            "Atualização para planos pagos disponível"
        ]
    },
    price: 59.99,
    activatePromo: true,
    promoPrice: 49.99
  },
  PREMIUM: {
    name: "Premium",
    maxServices: 50,
    menuLayout: 3,
    description: {
        title: "Plano Premium",
        text: "Ideal para clínicas de grande porte.",
        features: [
            "Limite de serviço ativo 50",
            "Limite cadastro de serviço 55",
            "Agendamento de consultas",
            "Página de agendamento",
            "Registro de consultas",            
            "Personalização de perfil",
            "Gerenciamento de pacientes",                
            "Ferramentas de IA",
            "Contato com suporte",
            "Mensagem informativa via WhatsApp",
            "Transcrição de voz em texto",
        ]
    },
    price: 97.99,
    activatePromo: true,
    promoPrice: 79.99
  }
};