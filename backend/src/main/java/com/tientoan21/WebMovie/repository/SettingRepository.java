package com.tientoan21.WebMovie.repository;

import com.tientoan21.WebMovie.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingRepository extends JpaRepository<Setting,Long> {
    Optional<Setting> findByConfigKey(String key);
}
