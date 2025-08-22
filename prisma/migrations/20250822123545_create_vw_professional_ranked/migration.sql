-- CreateView: vw_professional_ranked
-- Migration gerada para criar a view de profissionais ranqueados

CREATE VIEW public.vw_professional_ranked AS
SELECT 
    tt.*        
FROM (           
    SELECT              
        u.id,             
        u.name,             
        u.image,             
        u.address,             
        u.status,             
        (CASE WHEN array_length(u.times, 1) > 0 THEN true ELSE false END) as hastimes,             
        (CASE WHEN array_length(u.activities, 1) > 0 THEN true ELSE false END) as hasactivities,             
        u.activities,             
        s.id as subscription_id,              
        s.status as "subStatus",              
        s.plan,              
        s."priceId",              
        s."createdAt" as "subCreatedAt",              
        s."updatedAt" as "subUpdatedAt",              
        s."userId",                   
        (CASE                       
            WHEN s.plan IS NULL THEN 9
            WHEN s.plan = 'TOP' THEN 0                      
            WHEN s.plan = 'PREMIUM' THEN 1                      
            WHEN s.plan = 'PROFESSIONAL' THEN 2                       
            WHEN s.plan = 'BASIC' THEN 3                      
            WHEN s.plan = 'FREE' THEN 4                      
            ELSE 8                   
        END) as ranked           
    FROM "User" u           
    LEFT JOIN "Subscription" s ON u.id = s."userId"           
    WHERE u.status = true       
) tt       
WHERE (tt.hastimes = true AND tt.address IS NOT NULL AND tt.hasactivities = true)       
ORDER BY tt.ranked ASC, tt."subStatus" DESC, tt."subUpdatedAt" ASC;