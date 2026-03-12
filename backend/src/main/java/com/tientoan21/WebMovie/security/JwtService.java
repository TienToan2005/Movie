package com.tientoan21.WebMovie.security;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.tientoan21.WebMovie.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {
    @Value("${jwt.signerKey}")
    private String signerKey;
    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(User user){
        // header
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        //payload
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("tientoan21.com")
                .claim("scope", List.of(user.getRoleUser().name()))
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(expiration,ChronoUnit.MILLIS).toEpochMilli()))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        // ky token
        JWSObject jwsObject = new JWSObject(header,payload);
        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            e.printStackTrace();
            throw new RuntimeException("Khong the tao token: " + e.getMessage());
        }
    }
}
