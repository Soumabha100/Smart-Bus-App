package com.smartbus.system.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "system_heartbeat")
public class SystemHeartbeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "service_name", nullable = false, length = 64)
    private String serviceName;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(name = "checked_at")
    private OffsetDateTime checkedAt;

    public SystemHeartbeat() {}

    public SystemHeartbeat(String serviceName, String status, OffsetDateTime checkedAt) {
        this.serviceName = serviceName;
        this.status = status;
        this.checkedAt = checkedAt;
    }

    public Long getId() { return id; }
    public String getServiceName() { return serviceName; }
    public String getStatus() { return status; }
    public OffsetDateTime getCheckedAt() { return checkedAt; }
}

