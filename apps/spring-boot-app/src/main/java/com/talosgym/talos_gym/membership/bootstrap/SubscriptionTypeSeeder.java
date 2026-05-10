package com.talosgym.talos_gym.membership.bootstrap;

import com.talosgym.talos_gym.membership.model.SubscriptionType;
import com.talosgym.talos_gym.membership.repository.SubscriptionTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionTypeSeeder implements CommandLineRunner {

    private final SubscriptionTypeRepository repository;

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            log.info("SubscriptionType table is empty, seeding standard types...");

            SubscriptionType monthly = new SubscriptionType();
            monthly.setName("MONTHLY");
            monthly.setIntervalMonths(1);
            monthly.setPrepaid(false);

            SubscriptionType annualInstallment = new SubscriptionType();
            annualInstallment.setName("ANNUAL_INSTALLMENT");
            annualInstallment.setIntervalMonths(12);
            annualInstallment.setPrepaid(false);

            SubscriptionType annualPrepaid = new SubscriptionType();
            annualPrepaid.setName("ANNUAL_PREPAID");
            annualPrepaid.setIntervalMonths(12);
            annualPrepaid.setPrepaid(true);

            repository.saveAll(List.of(monthly, annualInstallment, annualPrepaid));

            log.info("SubscriptionType seeding completed successfully.");
        } else {
            log.info("SubscriptionType table already contains data, seeding skipped.");
        }
    }
}
