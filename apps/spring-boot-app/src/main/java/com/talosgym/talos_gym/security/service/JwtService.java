package com.talosgym.talos_gym.security.service;

import com.talosgym.talos_gym.config.SecurityProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final SecurityProperties securityProperties;
    private SecretKey signInKey;

    @PostConstruct
    public void init() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(securityProperties.getSecretKey());
            if (keyBytes.length < 32) {
                throw new IllegalArgumentException("JWT Secret Key must be at least 32 bytes (256 bits) long!");
            }
            this.signInKey = Keys.hmacShaKeyFor(keyBytes);
            log.info("JwtService initialized successfully.");
        } catch (Exception e) {
            log.error("Failed to initialize JwtService: {}", e.getMessage());
            throw e;
        }
    }

    public String extractIdentifier(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, securityProperties.getAccessToken().getExpiration());
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .id(UUID.randomUUID().toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signInKey)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String identifier = extractIdentifier(token);
        return (identifier.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(signInKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getRemainingExpirationMillis(String token) {
        try {
            Date expirationDate = extractClaim(token, Claims::getExpiration);
            return Math.max(0, (expirationDate.getTime() - System.currentTimeMillis()));
        } catch (Exception e) {
            return 0;
        }
    }
}
