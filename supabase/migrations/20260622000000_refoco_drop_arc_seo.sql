-- Refoco do produto: JB Digital System = só Site + GBP.
-- ARC e SEO Local arquivados em branch archive/arc-seo-local-pre-refoco.
--
-- Remove todas as tabelas dos módulos descontinuados.
-- CASCADE elimina automaticamente as políticas RLS e foreign keys associadas.

DROP TABLE IF EXISTS arc_clients          CASCADE;
DROP TABLE IF EXISTS arc_prospects        CASCADE;
DROP TABLE IF EXISTS seo_leads            CASCADE;
DROP TABLE IF EXISTS seo_lead_history     CASCADE;
DROP TABLE IF EXISTS service_metrics      CASCADE;
DROP TABLE IF EXISTS service_deliverables CASCADE;
