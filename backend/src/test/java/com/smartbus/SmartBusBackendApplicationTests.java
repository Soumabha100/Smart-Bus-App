package com.smartbus;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Disabled("Integration test requiring running PostgreSQL / Testcontainers container")
class SmartBusBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
