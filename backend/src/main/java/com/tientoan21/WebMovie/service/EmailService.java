package com.tientoan21.WebMovie.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpToEmail(String toEmail, String otp) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(toEmail);
            helper.setSubject("🔑 MÃ XÁC NHẬN KHÔI PHỤC MẬT KHẨU - TOANMOVIE");

            String htmlContent = String.format(
                    "<div style='font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 20px; text-align: center; border-radius: 10px;'>" +
                            "  <h1 style='color: #e50914;'>TOANMOVIE</h1>" +
                            "  <p style='font-size: 16px;'>Chào bạn, bạn đã yêu cầu đặt lại mật khẩu.</p>" +
                            "  <p style='font-size: 14px; color: #aaa;'>Mã xác nhận của bạn là:</p>" +
                            "  <div style='background-color: #333; padding: 15px; font-size: 30px; font-weight: bold; letter-spacing: 5px; color: #fff; margin: 20px 0;'>%s</div>" +
                            "  <p style='font-size: 12px; color: #888;'>Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>" +
                            "</div>", otp);

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi gửi mail!");
        }
    }
}
