package com.talosgym.talos_gym.infrastructure.adapter.locationiq;

import com.talosgym.talos_gym.club.dto.GeoLocationResult;
import com.talosgym.talos_gym.common.model.LocationProvider;
import com.talosgym.talos_gym.infrastructure.adapter.locationiq.dto.LocationIqResponse;
import com.talosgym.talos_gym.integration.location.port.IGeocodingPort;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Slf4j
@Service
public class LocationIqAdapter implements IGeocodingPort {

    private final RestClient restClient;
    private final String apiKey;
    private final String baseUrl;

    public LocationIqAdapter(
            RestClient.Builder restClientBuilder,
            @Value("${locationiq.api.key}") String apiKey) {
        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey;
        this.baseUrl = "https://us1.locationiq.com/v1/lookup?key={key}&osm_ids={osmIds}&format=json&addressdetails=1";
    }

    @Override
    public LocationProvider getProvider() {
        return LocationProvider.LOCATION_IQ;
    }

    @Override
    public Optional<GeoLocationResult> getPlaceDetailsById(String externalLocationId) {
        log.warn("Hold on tight!! Requesting LocationIQ API.");
        try {
            LocationIqResponse[] responseArray = restClient.get()
                    .uri(baseUrl, apiKey, externalLocationId)
                    .retrieve()
                    .body(LocationIqResponse[].class);

            if (responseArray != null && responseArray.length > 0) {
                if (responseArray.length > 1) {
                    log.warn("Warning! Multiple results ({}) returned from LocationIQ for ID: {}. Using the highest match (first result).",
                            responseArray.length, externalLocationId);
                }
                LocationIqResponse apiResponse = responseArray[0];
                return Optional.of(mapToDomainResult(externalLocationId, apiResponse));
            }

            return Optional.empty();

        } catch (HttpClientErrorException.NotFound | HttpClientErrorException.BadRequest e) {
            log.warn("Expected location not found from LocationIQ API. ID: {}", externalLocationId);
            return Optional.empty();
        } catch (Exception e) {
            log.error("An unexpected error occurred while requesting LocationIQ API. ID: {}", externalLocationId, e);
            return Optional.empty();
        }
    }

    private GeoLocationResult mapToDomainResult(String externalLocationId, LocationIqResponse response) {
        String city = null;
        String district = null;

        if (response.getAddress() != null) {
            city = extractCity(response.getAddress());
            district = extractDistrict(response.getAddress());
        }

        return GeoLocationResult.builder()
                .externalLocationId(externalLocationId)
                .provider(LocationProvider.LOCATION_IQ)
                .latitude(Double.parseDouble(response.getLat()))
                .longitude(Double.parseDouble(response.getLon()))
                .formattedAddress(response.getDisplayName())
                .city(city)
                .district(district)
                .build();
    }

    private String extractCity(LocationIqResponse.LocationIqAddress address) {
        if (address.getCity() != null) return address.getCity();
        if (address.getProvince() != null) return address.getProvince();
        return "Unknown";
    }

    private String extractDistrict(LocationIqResponse.LocationIqAddress address) {
        if (address.getCounty() != null) return address.getCounty();
        if (address.getDistrict() != null) return address.getDistrict();
        if (address.getSuburb() != null) return address.getSuburb();
        if (address.getTown() != null) return address.getTown();
        return "Unknown";
    }
}
