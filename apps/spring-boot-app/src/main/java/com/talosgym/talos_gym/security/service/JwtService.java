package com.talosgym.talos_gym.security.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKeyStr;
    @Value("${application.security.jwt.access-token.expiration}")
    private long accessTokenExpiration;

    private SecretKey signInKey;

    @PostConstruct
    public void init() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(secretKeyStr);
            if (keyBytes.length < 32) {
                throw new IllegalArgumentException("JWT Secret Key must be at least 32 byte (256 bit) long!");
            }
            this.signInKey = Keys.hmacShaKeyFor(keyBytes);
            log.info("JwtService initialized with modern JJWT 0.13.0 standards.");
        } catch (Exception e) {
            log.error("Failed to initialize JwtService: {}", e.getMessage());
            throw e;
        }

    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(String subject) {
        return buildToken(new HashMap<>(), subject, accessTokenExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, String subject) {
        return buildToken(extraClaims, subject, accessTokenExpiration);
    }

    public long getExpirationTime() {
        return accessTokenExpiration;
    }

    private String buildToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(signInKey)
                .compact();
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
}
