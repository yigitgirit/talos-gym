package com.talosgym.talos_gym;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class TalosGymApplication {
	public static void main(String[] args) {
		SpringApplication.run(TalosGymApplication.class, args);
	}
}
