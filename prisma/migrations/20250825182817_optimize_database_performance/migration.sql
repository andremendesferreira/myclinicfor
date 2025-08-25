-- Migration: optimize_database_performance
-- Otimizações de performance e índices compostos
-- ✅ VERSÃO CORRIGIDA (sem CONCURRENTLY para compatibilidade com Prisma)

-- 🔍 ÍNDICES COMPOSTOS CRÍTICOS
-- Para queries frequentes que combinam múltiplos campos

-- Appointments: busca por data + usuário (dashboard principal)
CREATE INDEX IF NOT EXISTS idx_appointments_user_date 
ON "Appointment"("userId", "appointmentDate" DESC);

-- Appointments: busca por serviço + data (relatórios)
CREATE INDEX IF NOT EXISTS idx_appointments_service_date 
ON "Appointment"("serviceId", "appointmentDate" DESC);

-- Patients: busca ativa por usuário (listagens filtradas)
CREATE INDEX IF NOT EXISTS idx_patients_user_status 
ON "patients"("userId", "status") 
WHERE "status" = true;

-- Consultations: busca por paciente + data (histórico médico)
CREATE INDEX IF NOT EXISTS idx_consultations_patient_date 
ON "consultations"("patientId", "consultationDate" DESC NULLS LAST);

-- Consultations: busca por usuário + status (dashboard médico)  
CREATE INDEX IF NOT EXISTS idx_consultations_user_status 
ON "consultations"("userId", "status", "consultationDate" DESC);

-- Services: serviços ativos por usuário (formulários de agendamento)
CREATE INDEX IF NOT EXISTS idx_services_user_status_active 
ON "Service"("userId", "status") 
WHERE "status" = true;

-- 📊 ÍNDICES PARA RELATÓRIOS E ANALYTICS

-- Appointments por mês (gráficos temporais)
CREATE INDEX IF NOT EXISTS idx_appointments_date_month 
ON "Appointment"(date_trunc('month', "appointmentDate"), "userId");

-- Subscriptions ativas para ranking
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_status 
ON "Subscription"("plan", "status", "updatedAt");

-- 🌐 ÍNDICES PARA RANKING PÚBLICO

-- Users: suporte ao ranking de profissionais
CREATE INDEX IF NOT EXISTS idx_users_ranking_support 
ON "User"("status", "address") 
WHERE "status" = true AND "address" IS NOT NULL AND "address" != '';

-- Horários disponíveis para agendamento público  
CREATE INDEX IF NOT EXISTS idx_users_public_booking 
ON "User"("id", "status") 
WHERE "status" = true AND array_length("times", 1) > 0;

-- ⚡ COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON INDEX idx_appointments_user_date IS 'Otimiza dashboard - agendamentos por usuário e data';
COMMENT ON INDEX idx_patients_user_status IS 'Otimiza listagem de pacientes ativos';
COMMENT ON INDEX idx_consultations_patient_date IS 'Otimiza histórico médico por paciente';
COMMENT ON INDEX idx_services_user_status_active IS 'Otimiza formulários de agendamento - serviços ativos';