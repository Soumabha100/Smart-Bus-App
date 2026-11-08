package com.smartbus.system;

import com.smartbus.config.SecurityConfig;
import com.smartbus.system.controller.SystemStatusController;
import com.smartbus.system.dto.SystemStatusResponse;
import com.smartbus.system.service.SystemStatusService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SystemStatusController.class)
@Import(SecurityConfig.class)
class SystemStatusControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SystemStatusService systemStatusService;

    @Test
    @DisplayName("GET /api/v1/system/status should return 200 with system health details")
    void shouldReturnSystemStatus() throws Exception {
        SystemStatusResponse mockResponse = new SystemStatusResponse(
            "UP",
            "CONNECTED",
            25,
            "smart-bus-backend",
            Instant.now()
        );

        given(systemStatusService.getSystemStatus()).willReturn(mockResponse);

        mockMvc.perform(get("/api/v1/system/status")
                .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.backendStatus").value("UP"))
            .andExpect(jsonPath("$.databaseStatus").value("CONNECTED"))
            .andExpect(jsonPath("$.databaseService").value("smart-bus-backend"));
    }
}

