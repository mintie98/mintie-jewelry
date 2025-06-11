USE Jewelry_DB;

-- Tắt kiểm tra khóa ngoại để chèn dữ liệu không bị lỗi thứ tự và xóa dữ liệu cũ
SET FOREIGN_KEY_CHECKS=0;

-- Xóa dữ liệu cũ của các bảng trước khi chèn mới để đảm bảo tính nhất quán
DELETE FROM `collection_products`;
DELETE FROM `product_images`;
DELETE FROM `product_quantities`;
DELETE FROM `product_attributes`;
DELETE FROM `product_categories`;
DELETE FROM `products`;
DELETE FROM `pages`;
DELETE FROM `shipping_methods`;
DELETE FROM `attribute_values`;
DELETE FROM `attributes`;
DELETE FROM `categories`;
DELETE FROM `user_addresses`;
DELETE FROM `users`;
DELETE FROM `collections`;

-- Reset AUTO_INCREMENT cho các bảng chính để bắt đầu lại từ 1
ALTER TABLE `users` AUTO_INCREMENT = 1;
ALTER TABLE `user_addresses` AUTO_INCREMENT = 1;
ALTER TABLE `categories` AUTO_INCREMENT = 1;
ALTER TABLE `attributes` AUTO_INCREMENT = 1;
ALTER TABLE `attribute_values` AUTO_INCREMENT = 1;
ALTER TABLE `shipping_methods` AUTO_INCREMENT = 1;
ALTER TABLE `pages` AUTO_INCREMENT = 1;
ALTER TABLE `products` AUTO_INCREMENT = 1;
ALTER TABLE `product_images` AUTO_INCREMENT = 1;
ALTER TABLE `product_quantities` AUTO_INCREMENT = 1;
ALTER TABLE `collections` AUTO_INCREMENT = 1;

-- 1. Users
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `full_name`, `phone`, `role`) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$yourbcryptpasswordhash', 'Quản Trị Viên', '0900000000', 'admin'),
(2, 'customer1', 'customer1@example.com', '$2b$10$anotherbcryptpasswordhash', 'Nguyễn Văn A', '0911111111', 'customer');

-- 2. User Addresses
INSERT INTO `user_addresses` (`id`, `user_id`, `full_name`, `phone`, `address_line1`, `ward_name`, `district_name`, `province_name`, `is_default_shipping`, `is_default_billing`) VALUES
(1, 2, 'Nguyễn Văn A - Nhà Riêng', '0911111111', '123 Đường ABC', 'Phường XYZ', 'Quận Ba Đình', 'Thành phố Hà Nội', TRUE, TRUE);

-- 3. Categories (6 danh mục chính)
INSERT INTO `categories` (`id`, `name`, `slug`, `display_order`, `image_url`) VALUES
(101, 'Nhẫn Kim Cương', 'nhan-kim-cuong', 1, '/uploads/categories/nhan-kim-cuong.jpg'),
(102, 'Nhẫn Cưới', 'nhan-cuoi', 2, '/uploads/categories/nhan-cuoi.jpg'),
(103, 'Nhẫn Cầu Hôn', 'nhan-cau-hon', 3, '/uploads/categories/nhan-cau-hon.jpg'),
(104, 'Bông Tai', 'bong-tai', 4, '/uploads/categories/bong-tai.jpg'),
(105, 'Dây Chuyền', 'day-chuyen', 5, '/uploads/categories/day-chuyen.jpg'),
(106, 'Vòng Tay', 'vong-tay', 6, '/uploads/categories/vong-tay.jpg');

-- 4. Attributes
INSERT INTO `attributes` (`id`, `name`, `display_name`) VALUES
(1, 'gold_purity', 'Độ tuổi vàng'),(2, 'metal_color', 'Màu sắc kim loại'),(3, 'main_stone_type', 'Loại đá chủ'),(4, 'gender_target', 'Giới tính'),(5, 'diamond_color', 'Nước kim cương (Color)'),(6, 'diamond_clarity', 'Độ tinh khiết KC (Clarity)'),(7, 'diamond_cut', 'Giác cắt KC (Cut)'),(8, 'diamond_carat_weight', 'Trọng lượng KC chủ (Carat)'),(9, 'certification_agency', 'Chứng nhận bởi'),(10, 'certification_number', 'Số Chứng Nhận'),(11, 'metal_weight_grams', 'Trọng lượng kim loại (gram)');

-- 5. Attribute Values
INSERT INTO `attribute_values` (`id`, `attribute_id`, `value`) VALUES
(1, 1, '10K'),(2, 1, '14K'),(3, 1, '18K'),(4, 1, '24K'),(5, 1, 'Không áp dụng'),
(6, 3, 'Vàng Vàng'),(7, 3, 'Vàng Trắng'),(8, 3, 'Vàng Hồng'),
(9, 4, 'Kim Cương'),(10, 4, 'Ruby'),(11, 4, 'Topaz'),(12, 4, 'Đá ECZ'),(13, 4, 'Moissanite'),(14, 4, 'Không đá'),
(15, 5, 'Nam'),(16, 5, 'Nữ'),(17, 5, 'Unisex'),
(18, 6, 'E'),(19, 6, 'F'),
(20, 7, 'VVS1'),(21, 7, 'VS1'),
(22, 8, 'Excellent'),(23, 8, 'Very Good'),
(24, 9, '0.4 ct'),(25, 9, '0.5 ct'),(26, 9, '0.6 ct'),(27, 9, '0.75 ct'),(28, 9, '1.0 ct'),
(29, 10, 'GIA'),(30, 10, 'IGI'),(31, 10, 'Không có'),
(32, 11, 'GIA12345'),(33, 11, 'IGI98765'),
(34, 12, '3.1 gram'),(35, 12, '3.8 gram'),(36, 12, '2.5 gram');

-- 6. Shipping Methods & Pages & Collections
INSERT INTO `shipping_methods` (`id`, `name`, `description`, `base_cost`) VALUES
(1, 'Giao hàng Tiêu chuẩn', 'Thời gian giao hàng dự kiến 3-5 ngày làm việc.', 30000.00),
(2, 'Giao hàng Nhanh', 'Thời gian giao hàng dự kiến 1-2 ngày làm việc.', 50000.00);

INSERT INTO `pages` (`id`, `title`, `slug`, `content`, `is_published`, `user_id`) VALUES
(1, 'Về Chúng Tôi', 've-chung-toi', '<p>Nội dung giới thiệu về công ty trang sức Jewelry...</p>', TRUE, 1),
(2, 'Chính Sách Bảo Hành', 'chinh-sach-bao-hanh', '<p>Chi tiết chính sách bảo hành sản phẩm...</p>', TRUE, 1);

INSERT INTO `collections` (`id`, `name`, `slug`, `description`, `image_url`) VALUES
(1, 'Tình Yêu Vĩnh Cửu', 'tinh-yeu-vinh-cuu', 'Bộ sưu tập nhẫn đính hôn và nhẫn cưới kim cương.', '/uploads/collections/1/banner.jpg'),
(2, 'Sắc Màu Rực Rỡ', 'sac-mau-ruc-ro', 'Trang sức đá màu mang lại may mắn và phong cách.', '/uploads/collections/2/banner.jpg');

-- ===================================================================================
-- 8. Products (CẬP NHẬT: 13 sản phẩm riêng biệt)
-- ===================================================================================
INSERT INTO `products` (`id`, `name`, `slug`, `sku`, `price`, `sale_price`, `description`, `category_id`, `is_featured`, `is_active`) VALUES
-- Category 101: Nhẫn Kim Cương
(1, 'Nhẫn Kim Cương Solitaire 18K 0.5ct GIA', 'nhan-kc-solitaire-vt18k-0-5ct-gia', 'DRDDVT18001', 75000000.00, 72500000.00, 'Nhẫn kim cương Solitaire 0.5ct nước E, VVS1, GIA. Vỏ vàng trắng 18K.', 101, TRUE, TRUE),
(2, 'Nhẫn Kim Cương Solitaire 18K 0.75ct IGI', 'nhan-kc-solitaire-vt18k-0-75ct-igi', 'DRDDVT18002', 110000000.00, NULL, 'Nhẫn kim cương Solitaire 0.75ct nước F, VS1, IGI. Vỏ vàng trắng 18K.', 101, TRUE, TRUE),
(3, 'Nhẫn Kim Cương Halo Vàng 14K', 'nhan-kc-halo-vh14k', 'DRDDVV14003', 48000000.00, NULL, 'Nhẫn kim cương Halo lộng lẫy trên nền vàng hồng 14K.', 101, FALSE, TRUE),
-- Category 102: Nhẫn Cưới
(4, 'Cặp Nhẫn Cưới Trơn Vàng Trắng 14K', 'cap-nhan-cuoi-tron-vt14k', 'WRNAVT14004', 12000000.00, NULL, 'Cặp nhẫn cưới trơn truyền thống, chế tác từ vàng trắng 14K.', 102, TRUE, TRUE),
(5, 'Cặp Nhẫn Cưới Vàng 18K Đính Kim Cương Tấm', 'cap-nhan-cuoi-vh18k-kc-tam', 'WRDDVH18005', 25000000.00, 23500000.00, 'Thiết kế nhẫn cưới hiện đại trên nền vàng hồng 18K, nhẫn nữ đính một hàng kim cương tấm.', 102, FALSE, TRUE),
-- Category 103: Nhẫn Cầu Hôn
(6, 'Nhẫn Cầu Hôn Kim Cương Princess 18K 0.6ct', 'nhan-cau-hon-kc-princess-vt18k-0-6ct', 'ERDDVT18006', 85000000.00, NULL, 'Nhẫn cầu hôn dáng Princess Cut kiêu sa, vàng trắng 18K, 0.6ct.', 103, TRUE, TRUE),
(7, 'Nhẫn Cầu Hôn Đá Moissanite Oval 14K 1.0ct', 'nhan-cau-hon-moissanite-oval-vv14k-1-0ct', 'ERMOVV14007', 18000000.00, 17000000.00, 'Nhẫn cầu hôn với viên đá Moissanite dáng Oval 1.0ct.', 103, FALSE, TRUE),
-- Category 104: Bông Tai
(8, 'Bông Tai Kim Cương Nụ 14K (Tổng 0.5ct)', 'bong-tai-kc-nu-vt14k-0-5ct', 'EEDDVT14008', 22000000.00, NULL, 'Đôi bông tai kim cương nụ cổ điển, mỗi bên 0.25ct, vàng trắng 14K.', 104, TRUE, TRUE),
(9, 'Bông Tai Dáng Dài 18K Đá Topaz Xanh', 'bong-tai-dang-dai-vv18k-topaz-xanh', 'EETPVV18009', 16000000.00, 15500000.00, 'Bông tai dáng dài thanh lịch từ vàng 18K, đính đá Topaz xanh biển.', 104, FALSE, TRUE),
-- Category 105: Dây Chuyền
(10, 'Dây Chuyền Vàng Trắng 18K Mặt Kim Cương Trái Tim', 'day-chuyen-vt18k-mat-kc-trai-tim', 'NNDDVT18010', 35000000.00, NULL, 'Dây chuyền vàng trắng 18K tinh xảo cùng mặt dây chuyền kim cương hình trái tim.', 105, TRUE, TRUE),
(11, 'Dây Chuyền Vàng 14K Dây Mì Ý Cho Nam', 'day-chuyen-vv14k-day-mi-y-nam', 'NNNAVV14011', 10500000.00, 10000000.00, 'Dây chuyền nam kiểu dây mì Ý cổ điển, chất liệu vàng 14K.', 105, FALSE, TRUE),
-- Category 106: Vòng Tay
(12, 'Vòng Tay Tennis Kim Cương Vàng Trắng 14K', 'vong-tay-tennis-kc-vt14k', 'BBDDVT14012', 65000000.00, NULL, 'Vòng tay tennis kim cương cổ điển trên nền vàng trắng 14K.', 106, TRUE, TRUE),
(13, 'Lắc Tay Vàng 18K Charm Bi May Mắn', 'lac-tay-vv18k-charm-bi-may-man', 'BBNAVV18013', 13500000.00, 13000000.00, 'Lắc tay vàng 18K với các charm bi nhỏ nhắn.', 106, FALSE, TRUE);
-- Sản phẩm thứ 13, thêm một chiếc nhẫn Halo khác

-- 9. Product Categories (Gán sản phẩm vào nhiều danh mục nếu cần)
INSERT INTO `product_categories` (`product_id`, `category_id`) VALUES
(1, 103), -- Nhẫn KC Solitaire (ID 1) cũng thuộc Nhẫn Cầu Hôn
(2, 103), -- Nhẫn KC Solitaire (ID 2) cũng thuộc Nhẫn Cầu Hôn
(5, 101); -- Nhẫn Cầu Hôn KC Princess (ID 5) cũng thuộc Nhẫn Kim Cương

-- 10. Product Attributes (Gán thuộc tính cho từng product_id)
INSERT INTO `product_attributes` (`product_id`, `attribute_value_id`) VALUES
-- Sản phẩm 1 (DRDDVT18001)
(1, 3), (1, 7), (1, 9), (1, 16), (1, 20), (1, 22), (1, 25), (1, 29), (1, 32), (1, 34),
-- Sản phẩm 3 (WRNAVT14004)
(3, 2), (3, 7), (3, 14), (3, 17);
-- (Thêm thuộc tính cho các sản phẩm khác)

-- 11. Product Quantities (Tồn kho theo product_id và Size)
INSERT INTO `product_quantities` (`product_id`, `size`, `quantity`) VALUES
(1, '6', 5), (1, '7', 8), (1, '8', 3),   -- Nhẫn KC Solitaire 0.5ct
(2, '6.5', 2), (2, '7.5', 4),            -- Nhẫn KC Solitaire 0.75ct
(3, 'Nam 10 / Nữ 7', 5), (3, 'Nam 11 / Nữ 8', 3), -- Cặp Nhẫn Cưới
(7, 'Tiêu chuẩn', 20),                    -- Bông tai
(10, '50cm', 12), (10, '55cm', 7);         -- Dây chuyền nam

-- 12. Product Images (Ảnh cho từng product_id)
INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(1, '/products/1/drddvt18001_main.jpg', TRUE, 0, ''),
(1, '/products/1/drddvt18001_1.jpg', FALSE, 1, ''),
(1, '/products/1/drddvt18001_2.jpg', FALSE, 2, ''),
(1, '/products/1/drddvt18001_3.jpg', FALSE, 3, ''),
(1, '/products/1/drddvt18001_4.jpg', FALSE, 4, ''),
(1, '/products/1/drddvt18001_5.jpg', FALSE, 5, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(2, '/products/2/drddvt18002_main.jpg', TRUE, 0, ''),
(2, '/products/2/drddvt18002_1.jpg', FALSE, 1, ''),
(2, '/products/2/drddvt18002_2.jpg', FALSE, 2, ''),
(2, '/products/2/drddvt18002_3.jpg', FALSE, 3, ''),
(2, '/products/2/drddvt18002_4.jpg', FALSE, 4, ''),
(2, '/products/2/drddvt18002_5.jpg', FALSE, 5, '');


INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(3, '/products/3/drddvv14003_main.jpg', TRUE, 0, ''),
(3, '/products/3/drddvv14003_1.jpg', FALSE, 1, ''),
(3, '/products/3/drddvv14003_2.jpg', FALSE, 2, ''),
(3, '/products/3/drddvv14003_3.jpg', FALSE, 3, ''),
(3, '/products/3/drddvv14003_4.jpg', FALSE, 4, ''),
(3, '/products/3/drddvv14003_5.jpg', FALSE, 5, ''),
(3, '/products/3/drddvv14003_6.jpg', FALSE, 6, '');


INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(4, '/products/4/wrnavt14004_main.jpg', TRUE, 0, ''),
(4, '/products/4/wrnavt14004_1.jpg', FALSE, 1, ''),
(4, '/products/4/wrnavt14004_2.jpg', FALSE, 2, ''),
(4, '/products/4/wrnavt14004_3.jpg', FALSE, 3, ''),
(4, '/products/4/wrnavt14004_4.jpg', FALSE, 4, ''),
(4, '/products/4/wrnavt14004_5.jpg', FALSE, 5, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(5, '/products/5/wrddvh18005_main.jpg', TRUE, 0, ''),
(5, '/products/5/wrddvh18005_1.jpg', FALSE, 1, ''),
(5, '/products/5/wrddvh18005_2.jpg', FALSE, 2, ''),
(5, '/products/5/wrddvh18005_3.jpg', FALSE, 3, ''),
(5, '/products/5/wrddvh18005_4.jpg', FALSE, 4, ''),
(5, '/products/5/wrddvh18005_5.jpg', FALSE, 5, '');


INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(6, '/products/6/erddvt18006_main.jpg', TRUE, 0, ''),
(6, '/products/6/erddvt18006_1.jpg', FALSE, 1, ''),
(6, '/products/6/erddvt18006_2.jpg', FALSE, 2, ''),
(6, '/products/6/erddvt18006_3.jpg', FALSE, 3, ''),
(6, '/products/6/erddvt18006_4.jpg', FALSE, 4, ''),
(6, '/products/6/erddvt18006_5.jpg', FALSE, 5, ''),
(6, '/products/6/erddvt18006_6.jpg', FALSE, 6, '');


INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(7, '/products/7/ermovv14007_main.jpg', TRUE, 0, ''),
(7, '/products/7/ermovv14007_1.jpg', FALSE, 1, ''),
(7, '/products/7/ermovv14007_2.jpg', FALSE, 2, ''),
(7, '/products/7/ermovv14007_3.jpg', FALSE, 3, ''),
(7, '/products/7/ermovv14007_4.jpg', FALSE, 4, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(8, '/products/8/eeddvt14008_main.jpg', TRUE, 0, ''),
(8, '/products/8/eeddvt14008_1.jpg', FALSE, 1, ''),
(8, '/products/8/eeddvt14008_2.jpg', FALSE, 2, ''),
(8, '/products/8/eeddvt14008_3.jpg', FALSE, 3, ''),
(8, '/products/8/eeddvt14008_4.jpg', FALSE, 4, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(9, '/products/9/eetpvv18009_main.jpg', TRUE, 0, ''),
(9, '/products/9/eetpvv18009_1.jpg', FALSE, 1, ''),
(9, '/products/9/eetpvv18009_2.jpg', FALSE, 2, ''),
(9, '/products/9/eetpvv18009_3.jpg', FALSE, 3, ''),
(9, '/products/9/eetpvv18009_4.jpg', FALSE, 4, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(10, '/products/10/nnddvt18010_main.jpg', TRUE, 0, ''),
(10, '/products/10/nnddvt18010_1.jpg', FALSE, 1, ''),
(10, '/products/10/nnddvt18010_2.jpg', FALSE, 2, ''),
(10, '/products/10/nnddvt18010_3.jpg', FALSE, 3, ''),
(10, '/products/10/nnddvt18010_4.jpg', FALSE, 4, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(11, '/products/11/nnnavv14011_main.jpg', TRUE, 0, ''),
(11, '/products/11/nnnavv14011_1.jpg', FALSE, 1, ''),
(11, '/products/11/nnnavv14011_2.jpg', FALSE, 2, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(12, '/products/12/bbddvt14012_main.jpg', TRUE, 0, ''),
(12, '/products/12/bbddvt14012_1.jpg', FALSE, 1, ''),
(12, '/products/12/bbddvt14012_2.jpg', FALSE, 2, ''),
(12, '/products/12/bbddvt14012_3.jpg', FALSE, 3, ''),
(12, '/products/12/bbddvt14012_4.jpg', FALSE, 4, '');

INSERT INTO `product_images` (`product_id`, `image_url`, `is_primary`, `display_order`, `alt_text`) VALUES
(13, '/products/13/bbnavv18013_main.jpg', TRUE, 0, ''),
(13, '/products/13/bbnavv18013_1.jpg', FALSE, 1, ''),
(13, '/products/13/bbnavv18013_2.jpg', FALSE, 2, ''),
(13, '/products/13/bbnavv18013_3.jpg', FALSE, 3, ''),
(13, '/products/13/bbnavv18013_4.jpg', FALSE, 4, '');


-- 13. Collection Products
INSERT INTO `collection_products` (`collection_id`, `product_id`) VALUES
(1, 1), (1, 2), (1, 5), -- Thêm các sản phẩm vào BST Tình Yêu Vĩnh Cửu
(2, 8);               -- Thêm sản phẩm vào BST Sắc Màu Rực Rỡ

SET FOREIGN_KEY_CHECKS=1;