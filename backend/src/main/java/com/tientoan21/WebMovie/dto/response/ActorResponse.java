package com.tientoan21.WebMovie.dto.response;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActorResponse {
    private String name;
    @Column(name = "profile_url", length = 1000)
    private String profileUrl;
}
