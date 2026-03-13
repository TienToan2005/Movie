package com.tientoan21.WebMovie.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.tientoan21.WebMovie.enums.ErrorCode;
import com.tientoan21.WebMovie.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;
    public String uploadFile(MultipartFile file, String folderName) {
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", "web_movie/" + folderName,
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Không thể xóa file trên Cloudinary");
        }
    }
}
