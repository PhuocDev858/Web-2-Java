package com.phuocotaku.user_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Lưu OTP tạm thời trong memory: email → otp
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public void generateAndSendOtp(String email) {
        String otp = generateOtp();
        otpStore.put(email, otp);

        // Tự xóa OTP sau 5 phút
        Executors.newSingleThreadScheduledExecutor()
                .schedule(() -> otpStore.remove(email), 5, TimeUnit.MINUTES);

        // Gửi email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP đặt lại mật khẩu - ComputerParts");
        message.setText(
            "Xin chào,\n\n" +
            "Mã OTP để đặt lại mật khẩu của bạn là: " + otp + "\n\n" +
            "Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.\n\n" +
            "Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.\n\n" +
            "Trân trọng,\nComputerParts Team"
        );
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        String stored = otpStore.get(email);
        if (stored != null && stored.equals(otp)) {
            otpStore.remove(email); // Xóa sau khi verify thành công
            return true;
        }
        return false;
    }
}