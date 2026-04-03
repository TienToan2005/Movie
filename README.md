🎬 ToanMovie - Movie Management SystemHệ thống quản trị và tổng hợp thông tin phim trực tuyến, được xây dựng theo kiến trúc Fullstack Modern Web với mục tiêu tối ưu hóa hiệu năng và bảo mật. Dự án tích hợp trực tiếp với TMDB API để cung cấp nguồn dữ liệu phim khổng lồ và chính xác.
🚀 Công nghệ sử dụng (Tech Stack)
 -Backend: Java 21, Spring Boot 3.x, Spring Data JPA
 -Security: Spring Security 6, JWT (Stateless), BCrypt
 -API Client: RestTemplate (Connect TMDB API)
 -Mapping: MapStruct, Java Records (DTO Pattern)
 -Database: MySQL 8.x
 -Frontend: Next.js 14, Tailwind CSS, Axios
 🛠 Hướng dẫn Build dự án
 1. Yêu cầu hệ thống (Prerequisites)
-JDK 21 (Bắt buộc để sử dụng Record và các tính năng mới).
-Maven 3.8+.MySQL Server (Đang chạy).
-API Key từ TMDB (Đăng ký tại: themoviedb.org).
2. Cấu hình Backend
Mở file src/main/resources/application.yml và cập nhật các thông số sau:Properties# Database Config
  spring.datasource.url=jdbc:mysql://localhost:3306/movie_db
  spring.datasource.username=root
  spring.datasource.password=your_password

# JWT Config
jwt.secret-key=your_super_secret_key_at_least_32_characters
jwt.expiration=3600000

# TMDB API Config
tmdb.api-key=your_tmdb_api_key
3. Chạy Backend (IntelliJ/Terminal)
Rebuild Project: Do sử dụng MapStruct, cần chạy lệnh build để MapStruct sinh ra các class Implementation (MapperImpl).
      - mvn clean install
Run Project: Chạy file WebMovieApplication.java.
Kiểm tra: Backend mặc định chạy tại http://localhost:8080.
4. Chạy Frontend
Truy cập thư mục frontend: 
      - cd frontend.
Cài đặt thư viện: 
      - npm install.
Chạy dự án: 
     - npm run dev.
Truy cập: http://localhost:3000.
Nếu muốn pulic thì dùng ngrok và localtunnel.
🔒 Quy chuẩn Phát triển & Bảo mật
Dữ liệu trả về: Luôn sử dụng ApiResponse<T> để đồng nhất cấu trúc JSON giữa Backend và Frontend.
Bảo mật: 
  Mật khẩu được băm bằng BCrypt trước khi lưu vào DB.
  Mọi request (trừ login/register) đều phải đính kèm JWT Header (Authorization: Bearer <token>).
  Sử dụng Spring Data Specification để chống SQL Injection khi tìm kiếm phim.
DTO Pattern: Tuyệt đối không trả Entity ra ngoài API. Sử dụng Record để làm DTO để đảm bảo tính bất biến (Immutability).
⚠️ Lưu ý khi gặp lỗi

401/403        Security Filter           Kiểm tra Token trong Header hoặc phân quyền Role trong SecurityConfig.
404            Service                   Kiểm tra logic tìm kiếm id phim hoặc tmdbId không tồn tại.
500            Controller / Service      Mở ngay Console Log trong IntelliJ.Nếu liên quan đến Mapping, hãy Rebuild Project.
429            TMDB API                  Đã gọi quá nhiều Request đến TMDB, hãy chờ hoặc kiểm tra API Key.
