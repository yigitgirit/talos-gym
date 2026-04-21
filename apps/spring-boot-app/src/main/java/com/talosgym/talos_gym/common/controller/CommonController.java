package com.talosgym.talos_gym.common.controller;

import com.talosgym.talos_gym.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/common")
public class CommonController {

    @GetMapping("/timezones")
    public ApiResponse<List<String>> getAvailableTimeZones() {
        List<String> zones = ZoneId.getAvailableZoneIds().stream()
                .sorted()
                .collect(Collectors.toList());

        return ApiResponse.success(zones);
    }
}
