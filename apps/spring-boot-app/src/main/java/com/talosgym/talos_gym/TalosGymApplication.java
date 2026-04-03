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

	// Notlar;
	// Bazı önemli ( user gibi ) domainler için domain service kullanimi yapılacak mı
	// UserService interface??? rolü nedir bu interface'in ve neden JpaUserService implementasyonu var. Orkestrasyonlar nerede yapılacak.
	// Neden JpaUserService sınıfında user nesneleri User olarak değil de var olarak karşılanıyor
	// CreateUser ile SaveUser farklı işler gibi gözüküyor. Create işlemi neden save'i de kapsıyor.
	// JpaUserService sınıfına neden controllerlardan erişilebiliyor
	// createRefreshToken ve updatePreference metodlarında jpa service bypass edilerek doğruca repository'e erişiyor.
	// UserManagementController doğruca JpaUserService sınıfından gelenleri dönüyor.

	// AuthPasswordService recipient kullanıcıdan almamalı zaten biliyor. Şifremi unuttum kısmında direkt SMS gitsin çünkü
	// telefon primary kimlik doğrulama aracıdır, eposta ikincil bildirim sistemidir. Orada strateji olmadan sadece telefon
	// kullan
}
