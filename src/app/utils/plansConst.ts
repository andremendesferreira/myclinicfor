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
    maxServices: 1,
    menuLayout: 0,
    description: {
        title: "Plano Gratuito",
        text: "Ideal para quem está começando.",
        features: [
            "Limite de serviço ativo 1",
            "Agendamento de consultas",
            "Página de agendamento",
            "Contato com suporte",
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
            "Agendamento de consultas",
            "Página de agendamento",
            "Personalização de perfil",
            "Suporte básico",
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
            "Agendamento de consultas",
            "Página de agendamento",
            "Registro de consultas",            
            "Personalização de perfil",
            "Gerenciamento de pacientes",                             
            "Ferramentas de IA",
            "Relatórios",
            "Suporte profissional",
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
            "Agendamento de consultas",
            "Página de agendamento",
            "Registro de consultas",            
            "Personalização de perfil",
            "Gerenciamento de pacientes",                
            "Ferramentas de IA",
            "Relatórios",
            "Suporte premium",
            "Transcrição de voz em texto",
            "Atualização e implantação de novas funcionalidades"
        ]
    },
    price: 97.99,
    activatePromo: true,
    promoPrice: 79.99
  }
};