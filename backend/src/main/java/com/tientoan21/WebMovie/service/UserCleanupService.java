package com.tientoan21.WebMovie.service;

import com.tientoan21.WebMovie.enums.UserStatus;
import com.tientoan21.WebMovie.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserCleanupService {

    private final UserRepository userRepository;

    // Cron chạy vào 00:00 mỗi ngày
    // Giây | Phút | Giờ | Ngày | Tháng | Thứ
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void deleteUnverifiedUsers() {
        log.info("Bắt đầu quét dọn tài khoản chưa xác thực...");

        // Lấy mốc thời gian 24 tiếng trước
        LocalDateTime threshold = LocalDateTime.now().minusHours(24);

        // Tìm và xóa các User có status = PENDING và tạo trước thời điểm threshold
        int deletedCount = userRepository.deleteByStatusAndCreatedAtBefore(
                UserStatus.PENDING,
                threshold
        );

        log.info("Đã xóa {} tài khoản rác thành công!", deletedCount);
    }
}
