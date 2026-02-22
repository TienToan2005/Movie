package com.tientoan21.WebMovie.entity;

import com.tientoan21.WebMovie.enums.RoleUser;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;
    private String email;
    @Column(name = "password_hash")
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    private RoleUser roleUser;
    private Boolean isActive;
}
