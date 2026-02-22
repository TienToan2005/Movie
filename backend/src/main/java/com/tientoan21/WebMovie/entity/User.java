package com.tientoan21.WebMovie.entity;

<<<<<<< HEAD
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
=======
public class User {
>>>>>>> 859c35ef2ab098ed0363490ae62a0f1f28f79d4a
}
