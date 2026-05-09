package com.talosgym.talos_gym.membership.controller;

import com.talosgym.talos_gym.membership.dto.CreateFeatureRequest;
import com.talosgym.talos_gym.membership.dto.FeatureResponse;
import com.talosgym.talos_gym.membership.dto.UpdateFeatureRequest;
import com.talosgym.talos_gym.membership.service.IFeatureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/management/features")
@RequiredArgsConstructor
public class FeatureController {

    private final IFeatureService featureService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FeatureResponse createFeature(@Valid @RequestBody CreateFeatureRequest request) {
        return featureService.createFeature(request);
    }

    @PutMapping("/{featureId}")
    public FeatureResponse updateFeature(@PathVariable Long featureId, @Valid @RequestBody UpdateFeatureRequest request) {
        return featureService.updateFeature(featureId, request);
    }

    @GetMapping("/{featureId}")
    public FeatureResponse getFeatureById(@PathVariable Long featureId) {
        return featureService.getFeatureById(featureId);
    }

    @GetMapping
    public List<FeatureResponse> getAllFeatures() {
        return featureService.getAllFeatures();
    }

    @DeleteMapping("/{featureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFeature(@PathVariable Long featureId) {
        featureService.deleteFeature(featureId);
    }
}
