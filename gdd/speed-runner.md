Game Design Document: Speed Runner
1. Tổng Quan
Speed Runner là một trò chơi đua tốc độ 2D trên nền tảng web, trong đó người chơi điều khiển một nhân vật cố định trên màn hình và chuyển đổi giữa 3 đường đua để thu thập speed boots, tránh chướng ngại vật làm giảm tốc độ, và về đích nhanh nhất có thể để đạt điểm số cao. Mục tiêu là về đích trong thời gian ngắn nhất để tối đa hóa điểm số, với hệ thống leaderboard để xếp hạng người chơi.
Thông Tin Chung

Thể loại: Đua tốc độ (Racing)
Nền tảng: Web
Chế độ chơi: Single-player
Phong cách đồ họa: 2D (sử dụng placeholder)
Âm thanh: Placeholder

2. Gameplay
2.1. Mục Tiêu

Người chơi phải về đích trên một trong 3 đường đua trong thời gian giới hạn.
Điểm số được tính dựa trên thời gian về đích: về đích sớm hơn thời gian giới hạn sẽ được cộng điểm thưởng.
Leaderboard hiển thị điểm số cao nhất của người chơi.

2.2. Cơ Chế Gameplay

Đường đua:
Có 3 đường đua song song (tầng 1, tầng 2, tầng 3) từ trái sang phải.
Mỗi đường đua có điểm xuất phát và đích riêng, với khoảng cách bằng nhau (giả định: 1000 đơn vị game).
Nhân vật người chơi đứng cố định ở giữa màn hình theo chiều ngang. Map di chuyển từ phải sang trái để tạo cảm giác chuyển động.


Chuyển đổi đường đua:
Người chơi click chuột trái vào một trong 3 khu vực (area) trên màn hình để chuyển nhân vật sang đường đua tương ứng (tầng 1, 2, hoặc 3).
Khi chuyển đổi, nhân vật có animation "nhảy lên" (từ tầng thấp hơn lên tầng cao hơn) hoặc "nhảy xuống" (từ tầng cao hơn xuống tầng thấp hơn).
Animation chuyển đổi kéo dài 0.5 giây, không có thời gian chờ (cooldown).


Tốc độ:
Tốc độ ban đầu: 50 đơn vị/giây.
Tốc độ tối đa: 100 đơn vị/giây (cố định, nhưng có thể nâng cấp thông qua gameplay trong các bản cập nhật tương lai).
Tốc độ ảnh hưởng đến tốc độ di chuyển của map (map di chuyển nhanh hơn nếu tốc độ người chơi tăng).
Animation của nhân vật (như chạy, nhảy) tăng tốc độ hiển thị tỷ lệ thuận với tốc độ hiện tại.


Speed Boots:
Mỗi đường đua có 4-6 speed boots, được đặt ở các vị trí cố định, cách đều nhau (giả định: khoảng cách 150-200 đơn vị giữa các boots).
Có hai loại speed boots:
Tăng tốc: Tăng tốc độ của người chơi (giá trị thay đổi, ví dụ: +10, +20, hoặc +30 đơn vị/giây).
Giảm tốc: Giảm tốc độ của người chơi (giá trị thay đổi, ví dụ: -10, -20, hoặc -30 đơn vị/giây).


Tổng giá trị tốc độ từ các speed boots được thiết kế để đạt tối đa tốc độ tối đa (100 đơn vị/giây).
Hiệu ứng speed boots là vĩnh viễn cho đến khi thu thập speed boots mới.
Người chơi tự động thu thập speed boots khi đi qua (không cần hành động bổ sung).


Thời gian và điểm số:
Mỗi màn chơi có thời gian giới hạn (giả định: 60 giây).
Nếu người chơi không về đích trong thời gian giới hạn, trò chơi kết thúc (game over), nhưng vẫn nhận điểm dựa trên tiến độ.
Công thức điểm số:
Điểm cơ bản = 1000 - (thời gian về đích (giây) * 10).
Điểm thưởng = (thời gian giới hạn - thời gian về đích) * 50 (nếu về đích trước thời gian giới hạn).
Ví dụ: Về đích trong 40 giây, điểm = 1000 - (40 * 10) + (60 - 40) * 50 = 1000 - 400 + 1000 = 1600 điểm.


Nếu không về đích, điểm = (khoảng cách đã đi / tổng khoảng cách) * 500.



2.3. Điều Khiển

Click chuột trái:
Click vào khu vực tầng 1 (phần trên màn hình): Chuyển sang đường đua 1.
Click vào khu vực tầng 2 (phần giữa màn hình): Chuyển sang đường đua 2.
Click vào khu vực tầng 3 (phần dưới màn hình): Chuyển sang đường đua 3.



3. Thiết Kế Kỹ Thuật
3.1. Thông Số Kỹ Thuật

Đơn vị game: 1 đơn vị = 1 pixel (giả định cho đơn giản).
Kích thước màn hình:
Độ phân giải: 1280x720 pixel.
Tỷ lệ khung hình: 16:9.


Kích thước đường đua:
Chiều dài: 1000 đơn vị.
Chiều cao mỗi đường đua: 200 pixel (tổng 600 pixel cho 3 đường đua, để lại 120 pixel cho UI).
Khoảng cách giữa các đường đua: 0 pixel (đường đua liền kề nhau theo chiều dọc).


Vị trí nhân vật:
Tọa độ X: 320 pixel (25% chiều rộng màn hình từ trái sang).
Tọa độ Y: Tùy thuộc vào đường đua:
Đường đua 1: Y = 160 pixel (trung tâm tầng 1).
Đường đua 2: Y = 360 pixel (trung tâm tầng 2).
Đường đua 3: Y = 560 pixel (trung tâm tầng 3).




Kích thước nhân vật: 50x50 pixel (placeholder).
Kích thước speed boots: 30x30 pixel (placeholder).
Tốc độ map:
Tốc độ di chuyển của map = tốc độ người chơi * -1 (di chuyển ngược lại để tạo cảm giác nhân vật chạy).


Thời gian animation chuyển đường đua: 0.5 giây.

3.2. Layer

Layer 1 (Background): Hình nền đường đua (placeholder, ví dụ: đường phố, rừng).
Layer 2 (Speed Boots): Các speed boots được vẽ trên đường đua, di chuyển cùng map.
Layer 3 (Player): Nhân vật người chơi, cố định tại X = 320 pixel, Y thay đổi theo đường đua.
Layer 4 (UI): Thanh tốc độ, progress bar, thời gian, và điểm số.

3.3. Collision

Collision với speed boots:
Sử dụng hitbox hình chữ nhật (rectangle) cho nhân vật và speed boots.
Kích thước hitbox nhân vật: 50x50 pixel.
Kích thước hitbox speed boots: 30x30 pixel.
Khi hitbox của nhân vật giao với hitbox của speed boots, speed boots được thu thập và biến mất.


Kiểm tra đích:
Khi tọa độ X của map (tương đối với nhân vật) đạt -1000 đơn vị (điểm đích), người chơi về đích.



3.4. Logic Game

Khởi tạo:
Đặt nhân vật ở đường đua 2 (Y = 360 pixel).
Tốc độ ban đầu: 50 đơn vị/giây.
Đặt 4-6 speed boots trên mỗi đường đua, cách đều nhau (khoảng cách 150-200 đơn vị).
Khởi tạo bộ đếm thời gian (60 giây).


Cập nhật mỗi frame:
Di chuyển map sang trái với tốc độ = tốc độ người chơi * -1.
Kiểm tra va chạm với speed boots để cập nhật tốc độ.
Cập nhật thanh tốc độ, progress bar, thời gian, và điểm số.
Nếu thời gian = 0 và chưa về đích, game over.
Nếu về đích, tính điểm và hiển thị leaderboard.


Chuyển đường đua:
Khi người chơi click vào khu vực tương ứng, cập nhật tọa độ Y của nhân vật và phát animation nhảy (0.5 giây).



4. Giao Diện Người Dùng (UI)
4.1. Layout

Thanh tốc độ (trái ngoài cùng):
Vị trí: X = 10 pixel, Y = 10 pixel.
Kích thước: 50x300 pixel (thanh dọc).
Hiển thị: Số tốc độ hiện tại (ví dụ: "50" đơn vị/giây) bên cạnh thanh.
Thanh đầy lên tỷ lệ với tốc độ (0-100 đơn vị/giây).


Thanh progress bar (trên cùng):
Vị trí: X = 300 pixel, Y = 10 pixel.
Kích thước: 680x30 pixel.
Hiển thị: Số phần trăm tiến độ (khoảng cách đã đi / 1000 * 100%).
Thanh đầy lên tỷ lệ với khoảng cách đã đi.


Thời gian (trên cùng, bên trái progress bar):
Vị trí: X = 200 pixel, Y = 10 pixel.
Kích thước: Font 24px.
Hiển thị: Số giây còn lại (giảm từ 60 về 0).


Điểm số (top-right):
Vị trí: X = 1100 pixel, Y = 10 pixel.
Kích thước: Font 24px.
Hiển thị: Điểm số hiện tại (cập nhật khi về đích hoặc game over).



4.2. Khu Vực Điều Khiển

Màn hình được chia thành 3 khu vực ngang để click:
Tầng 1: Y = 0 đến 240 pixel.
Tầng 2: Y = 240 đến 480 pixel.
Tầng 3: Y = 480 đến 720 pixel.



5. Đồ Họa và Âm Thanh

Đồ họa:
Nhân vật: Placeholder (hình chữ nhật 50x50 pixel).
Speed boots: Placeholder (hình vuông 30x30 pixel, màu xanh cho tăng tốc, đỏ cho giảm tốc).
Đường đua: Placeholder (hình chữ nhật 1280x200 pixel mỗi đường).


Âm thanh:
Nhạc nền: Placeholder.
Hiệu ứng âm thanh: Placeholder (khi thu thập speed boots, chuyển đường đua, về đích).



6. Game Over

Điều kiện:
Hết thời gian (60 giây) mà chưa về đích.
Vẫn nhận điểm dựa trên tiến độ: (khoảng cách đã đi / 1000) * 500.


Hành động:
Hiển thị màn hình game over với điểm số.
Cập nhật leaderboard.
Cho phép chơi lại hoặc thoát.



7. Leaderboard

Hiển thị top 10 điểm số cao nhất (lưu trữ cục bộ trên trình duyệt).
Cập nhật sau mỗi lần chơi (về đích hoặc game over).

