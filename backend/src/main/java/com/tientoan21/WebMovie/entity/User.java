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
    @Column(name = "full_name")
    private String fullName;
    private String email;
    @Column(name = "password_hash")
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(name = "role", columnDefinition = "VARCHAR(255)")
    private RoleUser roleUser;
    @Column(name = "is_active")
    private Boolean isActive;
}
