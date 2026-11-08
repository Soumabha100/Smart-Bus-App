-- V1__init_health_check.sql
-- Baseline Flyway migration to verify database connectivity and schema execution

CREATE TABLE IF NOT EXISTS system_heartbeat (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_heartbeat (service_name, status)
VALUES ('smart-bus-backend', 'HEALTHY')
ON CONFLICT DO NOTHING;

