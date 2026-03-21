-- Đảm bảo bảng đã tồn tại
CREATE TABLE settings (
              id INT AUTO_INCREMENT PRIMARY KEY,
              config_key VARCHAR(100) UNIQUE NOT NULL,
              config_value TEXT
);


INSERT INTO settings (config_key, config_value) VALUES
                             ('site_name', 'TOANMOVIE'),
                             ('primary_color', '#ef4444'),
                            ('site_logo', 'https://your-domain.com/logo.png')
ON DUPLICATE KEY UPDATE config_value = config_value;