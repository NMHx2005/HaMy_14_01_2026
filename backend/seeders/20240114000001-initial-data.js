/**
 * ===================================================================
 * SEEDER: DỮ LIỆU MẪU BAN ĐẦU
 * ===================================================================
 * Tạo dữ liệu mẫu cho hệ thống:
 * - User Groups (admin, librarian, reader)
 * - Admin account
 * - System settings
 * - Sample categories (Fields, Genres)
 * ===================================================================
 */

'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // ===================================================================
        // 1. TẠO NHÓM NGƯỜI DÙNG (User Groups)
        // ===================================================================
        await queryInterface.bulkInsert('user_groups', [
            {
                name: 'admin',
                description: 'Quản trị viên - Toàn quyền quản lý hệ thống',
                created_at: now,
                updated_at: now
            },
            {
                name: 'librarian',
                description: 'Thủ thư - Quản lý sách, mượn trả',
                created_at: now,
                updated_at: now
            },
            {
                name: 'reader',
                description: 'Độc giả - Tra cứu và mượn sách',
                created_at: now,
                updated_at: now
            }
        ]);

        // Lấy ID của các group
        const [groups] = await queryInterface.sequelize.query(
            "SELECT id, name FROM user_groups"
        );
        const adminGroupId = groups.find(g => g.name === 'admin').id;
        const librarianGroupId = groups.find(g => g.name === 'librarian').id;

        // ===================================================================
        // 2. TẠO TÀI KHOẢN ADMIN MẶC ĐỊNH
        // ===================================================================
        const hashedPassword = await bcrypt.hash('admin123', 10);

        await queryInterface.bulkInsert('accounts', [
            {
                group_id: adminGroupId,
                username: 'admin',
                password: hashedPassword,
                email: 'admin@library.com',
                status: 'active',
                created_at: now,
                updated_at: now
            },
            {
                group_id: librarianGroupId,
                username: 'librarian',
                password: hashedPassword,
                email: 'librarian@library.com',
                status: 'active',
                created_at: now,
                updated_at: now
            }
        ]);

        // Lấy ID của các account
        const [accounts] = await queryInterface.sequelize.query(
            "SELECT id, username FROM accounts"
        );
        const adminAccountId = accounts.find(a => a.username === 'admin').id;
        const librarianAccountId = accounts.find(a => a.username === 'librarian').id;

        // ===================================================================
        // 3. TẠO NHÂN VIÊN
        // ===================================================================
        await queryInterface.bulkInsert('staffs', [
            {
                account_id: adminAccountId,
                full_name: 'Quản trị viên',
                position: 'Quản trị viên hệ thống',
                phone: '0901234567',
                address: 'Thư viện ABC',
                created_at: now,
                updated_at: now
            },
            {
                account_id: librarianAccountId,
                full_name: 'Nguyễn Văn Thủ Thư',
                position: 'Thủ thư',
                phone: '0907654321',
                address: 'Thư viện ABC',
                created_at: now,
                updated_at: now
            }
        ]);

        // ===================================================================
        // 4. TẠO CẤU HÌNH HỆ THỐNG
        // ===================================================================
        await queryInterface.bulkInsert('system_settings', [
            {
                setting_key: 'fine_rate_percent',
                setting_value: '10',
                description: 'Phần trăm tiền phạt trễ hạn (% giá sách / ngày)',
                updated_at: now
            },
            {
                setting_key: 'default_borrow_days',
                setting_value: '14',
                description: 'Số ngày mượn mặc định',
                updated_at: now
            },
            {
                setting_key: 'default_max_books',
                setting_value: '5',
                description: 'Số sách tối đa được mượn cùng lúc',
                updated_at: now
            },
            {
                setting_key: 'default_deposit_amount',
                setting_value: '200000',
                description: 'Tiền đặt cọc mặc định (VND)',
                updated_at: now
            },
            {
                setting_key: 'library_name',
                setting_value: 'Thư viện ABC',
                description: 'Tên thư viện',
                updated_at: now
            },
            {
                setting_key: 'library_address',
                setting_value: '123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh',
                description: 'Địa chỉ thư viện',
                updated_at: now
            },
            {
                setting_key: 'library_phone',
                setting_value: '028-1234-5678',
                description: 'Số điện thoại liên hệ',
                updated_at: now
            }
        ]);

        // ===================================================================
        // 5. TẠO LĨNH VỰC MẪU
        // ===================================================================
        await queryInterface.bulkInsert('fields', [
            { code: 'KHTN', name: 'Khoa học Tự nhiên', description: 'Toán, Lý, Hóa, Sinh học', created_at: now, updated_at: now },
            { code: 'KHXH', name: 'Khoa học Xã hội', description: 'Lịch sử, Địa lý, Triết học', created_at: now, updated_at: now },
            { code: 'CNTT', name: 'Công nghệ Thông tin', description: 'Lập trình, Mạng máy tính, AI', created_at: now, updated_at: now },
            { code: 'KTQT', name: 'Kinh tế - Quản trị', description: 'Kinh tế, Quản trị kinh doanh, Tài chính', created_at: now, updated_at: now },
            { code: 'VHNT', name: 'Văn hóa - Nghệ thuật', description: 'Văn học, Âm nhạc, Hội họa', created_at: now, updated_at: now },
            { code: 'NNNG', name: 'Ngoại ngữ', description: 'Tiếng Anh, Tiếng Trung, Tiếng Nhật', created_at: now, updated_at: now },
            { code: 'KHSK', name: 'Y tế - Sức khỏe', description: 'Y học, Dược học, Điều dưỡng', created_at: now, updated_at: now },
            { code: 'PLCT', name: 'Pháp luật - Chính trị', description: 'Luật, Chính trị học', created_at: now, updated_at: now }
        ]);

        // ===================================================================
        // 6. TẠO THỂ LOẠI MẪU
        // ===================================================================
        await queryInterface.bulkInsert('genres', [
            { code: 'GT', name: 'Giáo trình', description: 'Sách giáo khoa, giáo trình đại học', created_at: now, updated_at: now },
            { code: 'TK', name: 'Tham khảo', description: 'Sách tham khảo chuyên ngành', created_at: now, updated_at: now },
            { code: 'NCKH', name: 'Nghiên cứu khoa học', description: 'Luận văn, luận án, bài báo khoa học', created_at: now, updated_at: now },
            { code: 'VH', name: 'Văn học', description: 'Tiểu thuyết, truyện ngắn, thơ', created_at: now, updated_at: now },
            { code: 'TT', name: 'Từ điển', description: 'Từ điển các loại', created_at: now, updated_at: now },
            { code: 'BK', name: 'Bách khoa', description: 'Từ điển bách khoa', created_at: now, updated_at: now },
            { code: 'THTN', name: 'Thực hành - Thí nghiệm', description: 'Sách hướng dẫn thực hành', created_at: now, updated_at: now },
            { code: 'TC', name: 'Tạp chí', description: 'Tạp chí khoa học, chuyên ngành', created_at: now, updated_at: now }
        ]);

        // ===================================================================
        // 7. TẠO NHÀ XUẤT BẢN MẪU
        // ===================================================================
        await queryInterface.bulkInsert('publishers', [
            { name: 'NXB Giáo dục Việt Nam', address: 'Hà Nội', phone: '024-3822-0801', email: 'info@nxbgd.vn', created_at: now, updated_at: now },
            { name: 'NXB Đại học Quốc gia Hà Nội', address: 'Hà Nội', phone: '024-3558-4082', email: 'nxb@vnu.edu.vn', created_at: now, updated_at: now },
            { name: 'NXB Đại học Quốc gia TP.HCM', address: 'TP. Hồ Chí Minh', phone: '028-3824-2656', email: 'nxb@vnuhcm.edu.vn', created_at: now, updated_at: now },
            { name: 'NXB Khoa học và Kỹ thuật', address: 'Hà Nội', phone: '024-3822-2367', email: 'info@nxbkhkt.com.vn', created_at: now, updated_at: now },
            { name: 'NXB Trẻ', address: 'TP. Hồ Chí Minh', phone: '028-3930-5859', email: 'hopthubandoc@nxbtre.com.vn', created_at: now, updated_at: now },
            { name: 'NXB Kim Đồng', address: 'Hà Nội', phone: '024-3942-4730', email: 'info@nxbkimdong.com.vn', created_at: now, updated_at: now },
            { name: 'NXB Lao động', address: 'Hà Nội', phone: '024-3851-5380', email: 'nxblaodong@gmail.com', created_at: now, updated_at: now },
            { name: 'NXB Thống kê', address: 'Hà Nội', phone: '024-3733-4970', email: 'nxbthongke@gso.gov.vn', created_at: now, updated_at: now }
        ]);

        // ===================================================================
        // 8. TẠO TÁC GIẢ MẪU
        // ===================================================================
        await queryInterface.bulkInsert('authors', [
            { name: 'Nguyễn Văn A', title: 'PGS.TS', workplace: 'Đại học Bách khoa Hà Nội', bio: 'Chuyên gia về khoa học máy tính', created_at: now, updated_at: now },
            { name: 'Trần Thị B', title: 'TS', workplace: 'Đại học Khoa học Tự nhiên', bio: 'Nghiên cứu về toán ứng dụng', created_at: now, updated_at: now },
            { name: 'Lê Văn C', title: 'ThS', workplace: 'Đại học Kinh tế Quốc dân', bio: 'Chuyên gia kinh tế', created_at: now, updated_at: now },
            { name: 'Phạm Thị D', title: 'GS.TSKH', workplace: 'Viện Hàn lâm KHXH', bio: 'Nghiên cứu văn học', created_at: now, updated_at: now },
            { name: 'Hoàng Văn E', title: 'TS', workplace: 'Đại học Y Hà Nội', bio: 'Bác sĩ chuyên khoa', created_at: now, updated_at: now },
            { name: 'Võ Thị F', title: 'PGS.TS', workplace: 'Đại học Công nghệ Thông tin', bio: 'Chuyên gia về trí tuệ nhân tạo', created_at: now, updated_at: now },
            { name: 'Đặng Văn G', title: 'TS', workplace: 'Đại học Bách khoa TP.HCM', bio: 'Nghiên cứu về mạng máy tính', created_at: now, updated_at: now },
            { name: 'Bùi Thị H', title: 'ThS', workplace: 'Đại học Kinh tế TP.HCM', bio: 'Chuyên gia tài chính', created_at: now, updated_at: now },
            { name: 'Ngô Văn I', title: 'GS.TS', workplace: 'Đại học Sư phạm Hà Nội', bio: 'Nhà văn, nhà nghiên cứu văn học', created_at: now, updated_at: now },
            { name: 'Phan Thị K', title: 'TS', workplace: 'Đại học Y Dược TP.HCM', bio: 'Bác sĩ chuyên khoa tim mạch', created_at: now, updated_at: now }
        ]);

        // Lấy ID của các bảng đã tạo
        const [fields] = await queryInterface.sequelize.query("SELECT id, code FROM fields");
        const [genres] = await queryInterface.sequelize.query("SELECT id, code FROM genres");
        const [publishers] = await queryInterface.sequelize.query("SELECT id, name FROM publishers");
        const [authors] = await queryInterface.sequelize.query("SELECT id, name FROM authors");
        const [staffs] = await queryInterface.sequelize.query("SELECT id FROM staffs");
        const readerGroupId = groups.find(g => g.name === 'reader').id;
        const staffIds = staffs.map(s => s.id);
        const librarianStaffId = staffIds[1]; // Thủ thư

        // ===================================================================
        // 9. TẠO TÀI KHOẢN ĐỘC GIẢ
        // ===================================================================
        const readerPassword = await bcrypt.hash('reader123', 10);
        const readerAccounts = [
            { group_id: readerGroupId, username: 'reader001', password: readerPassword, email: 'reader001@library.com', status: 'active', created_at: now, updated_at: now },
            {
                group_id: readerGroupId, username: 'reader002', password: readerPassword, email: 'hungnm22092005@gmail.com', status: 'active', created_at: now, updated_at: now
            },
            { group_id: readerGroupId, username: 'reader003', password: readerPassword, email: 'reader003@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader004', password: readerPassword, email: 'reader004@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader005', password: readerPassword, email: 'reader005@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader006', password: readerPassword, email: 'reader006@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader007', password: readerPassword, email: 'reader007@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader008', password: readerPassword, email: 'reader008@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader009', password: readerPassword, email: 'reader009@library.com', status: 'active', created_at: now, updated_at: now },
            { group_id: readerGroupId, username: 'reader010', password: readerPassword, email: 'reader010@library.com', status: 'active', created_at: now, updated_at: now }
        ];
        await queryInterface.bulkInsert('accounts', readerAccounts);

        // Lấy ID của các reader accounts
        const [allAccounts] = await queryInterface.sequelize.query("SELECT id, username FROM accounts WHERE username LIKE 'reader%' ORDER BY id");
        const readerAccountIds = allAccounts.map(a => a.id);

        // ===================================================================
        // 10. TẠO ĐỘC GIẢ
        // ===================================================================
        const readers = [
            { account_id: readerAccountIds[0], id_card_number: '001234567890', full_name: 'Nguyễn Văn An', birth_date: '2000-05-15', address: '123 Đường Lê Lợi, Quận 1, TP.HCM', phone: '0901111111', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[1], id_card_number: '001234567891', full_name: 'Trần Thị Bình', birth_date: '1999-08-20', address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', phone: '0902222222', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[2], id_card_number: '001234567892', full_name: 'Lê Văn Cường', birth_date: '1998-03-10', address: '789 Đường Võ Văn Tần, Quận 3, TP.HCM', phone: '0903333333', title: 'Giảng viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[3], id_card_number: '001234567893', full_name: 'Phạm Thị Dung', birth_date: '2001-11-25', address: '321 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', phone: '0904444444', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[4], id_card_number: '001234567894', full_name: 'Hoàng Văn Em', birth_date: '1997-07-05', address: '654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM', phone: '0905555555', title: 'Nghiên cứu sinh', created_at: now, updated_at: now },
            { account_id: readerAccountIds[5], id_card_number: '001234567895', full_name: 'Võ Thị Phương', birth_date: '2000-09-12', address: '987 Đường Lý Tự Trọng, Quận 1, TP.HCM', phone: '0906666666', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[6], id_card_number: '001234567896', full_name: 'Đặng Văn Giang', birth_date: '1999-01-30', address: '147 Đường Pasteur, Quận 3, TP.HCM', phone: '0907777777', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[7], id_card_number: '001234567897', full_name: 'Bùi Thị Hoa', birth_date: '1998-06-18', address: '258 Đường Nam Kỳ Khởi Nghĩa, Quận 3, TP.HCM', phone: '0908888888', title: 'Giảng viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[8], id_card_number: '001234567898', full_name: 'Ngô Văn Ích', birth_date: '2001-04-22', address: '369 Đường Trần Hưng Đạo, Quận 5, TP.HCM', phone: '0909999999', title: 'Sinh viên', created_at: now, updated_at: now },
            { account_id: readerAccountIds[9], id_card_number: '001234567899', full_name: 'Phan Thị Kim', birth_date: '1997-12-08', address: '741 Đường Nguyễn Trãi, Quận 5, TP.HCM', phone: '0900000000', title: 'Nghiên cứu sinh', created_at: now, updated_at: now }
        ];
        await queryInterface.bulkInsert('readers', readers);

        // Lấy ID của các readers
        const [allReaders] = await queryInterface.sequelize.query("SELECT id, full_name FROM readers ORDER BY id");
        const readerIds = allReaders.map(r => r.id);

        // ===================================================================
        // 11. TẠO THẺ THƯ VIỆN
        // ===================================================================
        const issueDate = new Date('2024-01-01');
        const expiryDate = new Date('2025-12-31');
        const libraryCards = readerIds.map((readerId, index) => ({
            card_number: `TV2024${String(index + 1).padStart(3, '0')}`,
            reader_id: readerId,
            issue_date: issueDate,
            expiry_date: expiryDate,
            max_books: 5,
            max_borrow_days: 14,
            deposit_amount: 200000.00,
            status: index < 8 ? 'active' : (index === 8 ? 'expired' : 'locked'),
            created_at: now,
            updated_at: now
        }));
        await queryInterface.bulkInsert('library_cards', libraryCards);

        // Lấy ID của các library cards
        const [allCards] = await queryInterface.sequelize.query("SELECT id, reader_id FROM library_cards ORDER BY id");
        const cardIds = allCards.map(c => c.id);

        // ===================================================================
        // 12. TẠO GIAO DỊCH CỌC
        // ===================================================================
        const depositTransactions = cardIds.map((cardId, index) => ({
            library_card_id: cardId,
            staff_id: librarianStaffId,
            amount: 200000.00,
            type: 'deposit',
            transaction_date: issueDate,
            notes: `Nạp tiền đặt cọc khi làm thẻ thư viện`,
            created_at: now,
            updated_at: now
        }));
        await queryInterface.bulkInsert('deposit_transactions', depositTransactions);

        // ===================================================================
        // 13. TẠO SÁCH
        // ===================================================================
        const fieldMap = {};
        fields.forEach(f => { fieldMap[f.code] = f.id; });
        const genreMap = {};
        genres.forEach(g => { genreMap[g.code] = g.id; });

        const books = [
            { code: 'CNTT001', title: 'Lập trình Java cơ bản', field_id: fieldMap['CNTT'], genre_id: genreMap['GT'], page_count: 350, size: '16x24cm', description: 'Giáo trình lập trình Java từ cơ bản đến nâng cao', created_at: now, updated_at: now },
            { code: 'CNTT002', title: 'Cấu trúc dữ liệu và giải thuật', field_id: fieldMap['CNTT'], genre_id: genreMap['GT'], page_count: 450, size: '16x24cm', description: 'Giáo trình về cấu trúc dữ liệu và các thuật toán cơ bản', created_at: now, updated_at: now },
            { code: 'CNTT003', title: 'Trí tuệ nhân tạo và Machine Learning', field_id: fieldMap['CNTT'], genre_id: genreMap['TK'], page_count: 520, size: '16x24cm', description: 'Sách tham khảo về AI và Machine Learning', created_at: now, updated_at: now },
            { code: 'CNTT004', title: 'Mạng máy tính và Internet', field_id: fieldMap['CNTT'], genre_id: genreMap['GT'], page_count: 380, size: '16x24cm', description: 'Giáo trình về mạng máy tính và công nghệ Internet', created_at: now, updated_at: now },
            { code: 'KHTN001', title: 'Toán cao cấp', field_id: fieldMap['KHTN'], genre_id: genreMap['GT'], page_count: 400, size: '16x24cm', description: 'Giáo trình toán cao cấp cho sinh viên đại học', created_at: now, updated_at: now },
            { code: 'KHTN002', title: 'Vật lý đại cương', field_id: fieldMap['KHTN'], genre_id: genreMap['GT'], page_count: 360, size: '16x24cm', description: 'Giáo trình vật lý đại cương', created_at: now, updated_at: now },
            { code: 'KTQT001', title: 'Kinh tế vi mô', field_id: fieldMap['KTQT'], genre_id: genreMap['GT'], page_count: 420, size: '16x24cm', description: 'Giáo trình kinh tế vi mô', created_at: now, updated_at: now },
            { code: 'KTQT002', title: 'Quản trị kinh doanh', field_id: fieldMap['KTQT'], genre_id: genreMap['GT'], page_count: 480, size: '16x24cm', description: 'Giáo trình quản trị kinh doanh', created_at: now, updated_at: now },
            { code: 'VHNT001', title: 'Văn học Việt Nam hiện đại', field_id: fieldMap['VHNT'], genre_id: genreMap['VH'], page_count: 320, size: '14x20cm', description: 'Tuyển tập các tác phẩm văn học Việt Nam hiện đại', created_at: now, updated_at: now },
            { code: 'VHNT002', title: 'Thơ ca Việt Nam', field_id: fieldMap['VHNT'], genre_id: genreMap['VH'], page_count: 280, size: '14x20cm', description: 'Tuyển tập thơ ca Việt Nam qua các thời kỳ', created_at: now, updated_at: now },
            { code: 'NNNG001', title: 'Tiếng Anh giao tiếp', field_id: fieldMap['NNNG'], genre_id: genreMap['GT'], page_count: 300, size: '16x24cm', description: 'Giáo trình tiếng Anh giao tiếp', created_at: now, updated_at: now },
            { code: 'NNNG002', title: 'Từ điển Anh - Việt', field_id: fieldMap['NNNG'], genre_id: genreMap['TT'], page_count: 1200, size: '14x20cm', description: 'Từ điển Anh - Việt đầy đủ', created_at: now, updated_at: now },
            { code: 'KHSK001', title: 'Y học cơ sở', field_id: fieldMap['KHSK'], genre_id: genreMap['GT'], page_count: 500, size: '16x24cm', description: 'Giáo trình y học cơ sở', created_at: now, updated_at: now },
            { code: 'PLCT001', title: 'Luật dân sự Việt Nam', field_id: fieldMap['PLCT'], genre_id: genreMap['GT'], page_count: 600, size: '16x24cm', description: 'Giáo trình luật dân sự', created_at: now, updated_at: now },
            { code: 'KHXH001', title: 'Lịch sử Việt Nam', field_id: fieldMap['KHXH'], genre_id: genreMap['GT'], page_count: 450, size: '16x24cm', description: 'Giáo trình lịch sử Việt Nam', created_at: now, updated_at: now }
        ];
        await queryInterface.bulkInsert('books', books);

        // Lấy ID của các books
        const [allBooks] = await queryInterface.sequelize.query("SELECT id, code FROM books ORDER BY id");
        const bookIds = allBooks.map(b => b.id);

        // ===================================================================
        // 14. TẠO QUAN HỆ SÁCH - TÁC GIẢ
        // ===================================================================
        const authorIds = authors.map(a => a.id);
        const bookAuthors = [
            { book_id: bookIds[0], author_id: authorIds[0], created_at: now }, // CNTT001 - Nguyễn Văn A
            { book_id: bookIds[1], author_id: authorIds[0], created_at: now }, // CNTT002 - Nguyễn Văn A
            { book_id: bookIds[1], author_id: authorIds[1], created_at: now }, // CNTT002 - Trần Thị B
            { book_id: bookIds[2], author_id: authorIds[5], created_at: now }, // CNTT003 - Võ Thị F
            { book_id: bookIds[3], author_id: authorIds[6], created_at: now }, // CNTT004 - Đặng Văn G
            { book_id: bookIds[4], author_id: authorIds[1], created_at: now }, // KHTN001 - Trần Thị B
            { book_id: bookIds[5], author_id: authorIds[1], created_at: now }, // KHTN002 - Trần Thị B
            { book_id: bookIds[6], author_id: authorIds[2], created_at: now }, // KTQT001 - Lê Văn C
            { book_id: bookIds[7], author_id: authorIds[2], created_at: now }, // KTQT002 - Lê Văn C
            { book_id: bookIds[7], author_id: authorIds[7], created_at: now }, // KTQT002 - Bùi Thị H
            { book_id: bookIds[8], author_id: authorIds[3], created_at: now }, // VHNT001 - Phạm Thị D
            { book_id: bookIds[9], author_id: authorIds[3], created_at: now }, // VHNT002 - Phạm Thị D
            { book_id: bookIds[9], author_id: authorIds[8], created_at: now }, // VHNT002 - Ngô Văn I
            { book_id: bookIds[10], author_id: authorIds[0], created_at: now }, // NNNG001 - Nguyễn Văn A
            { book_id: bookIds[11], author_id: authorIds[0], created_at: now }, // NNNG002 - Nguyễn Văn A
            { book_id: bookIds[12], author_id: authorIds[4], created_at: now }, // KHSK001 - Hoàng Văn E
            { book_id: bookIds[12], author_id: authorIds[9], created_at: now }, // KHSK001 - Phan Thị K
            { book_id: bookIds[13], author_id: authorIds[2], created_at: now }, // PLCT001 - Lê Văn C
            { book_id: bookIds[14], author_id: authorIds[3], created_at: now }  // KHXH001 - Phạm Thị D
        ];
        await queryInterface.bulkInsert('book_authors', bookAuthors);

        // ===================================================================
        // 15. TẠO PHIÊN BẢN XUẤT BẢN
        // ===================================================================
        const publisherIds = publishers.map(p => p.id);
        const bookEditions = [
            { book_id: bookIds[0], publisher_id: publisherIds[2], publish_year: 2023, isbn: '978-604-123-456-7', created_at: now, updated_at: now }, // CNTT001
            { book_id: bookIds[0], publisher_id: publisherIds[2], publish_year: 2024, isbn: '978-604-123-456-8', created_at: now, updated_at: now }, // CNTT001 - tái bản
            { book_id: bookIds[1], publisher_id: publisherIds[1], publish_year: 2022, isbn: '978-604-234-567-8', created_at: now, updated_at: now }, // CNTT002
            { book_id: bookIds[2], publisher_id: publisherIds[3], publish_year: 2023, isbn: '978-604-345-678-9', created_at: now, updated_at: now }, // CNTT003
            { book_id: bookIds[3], publisher_id: publisherIds[2], publish_year: 2024, isbn: '978-604-456-789-0', created_at: now, updated_at: now }, // CNTT004
            { book_id: bookIds[4], publisher_id: publisherIds[0], publish_year: 2021, isbn: '978-604-567-890-1', created_at: now, updated_at: now }, // KHTN001
            { book_id: bookIds[5], publisher_id: publisherIds[0], publish_year: 2022, isbn: '978-604-678-901-2', created_at: now, updated_at: now }, // KHTN002
            { book_id: bookIds[6], publisher_id: publisherIds[1], publish_year: 2023, isbn: '978-604-789-012-3', created_at: now, updated_at: now }, // KTQT001
            { book_id: bookIds[7], publisher_id: publisherIds[1], publish_year: 2024, isbn: '978-604-890-123-4', created_at: now, updated_at: now }, // KTQT002
            { book_id: bookIds[8], publisher_id: publisherIds[4], publish_year: 2022, isbn: '978-604-901-234-5', created_at: now, updated_at: now }, // VHNT001
            { book_id: bookIds[9], publisher_id: publisherIds[4], publish_year: 2023, isbn: '978-604-012-345-6', created_at: now, updated_at: now }, // VHNT002
            { book_id: bookIds[10], publisher_id: publisherIds[2], publish_year: 2023, isbn: '978-604-123-789-0', created_at: now, updated_at: now }, // NNNG001
            { book_id: bookIds[11], publisher_id: publisherIds[2], publish_year: 2024, isbn: '978-604-234-890-1', created_at: now, updated_at: now }, // NNNG002
            { book_id: bookIds[12], publisher_id: publisherIds[1], publish_year: 2022, isbn: '978-604-345-901-2', created_at: now, updated_at: now }, // KHSK001
            { book_id: bookIds[13], publisher_id: publisherIds[1], publish_year: 2023, isbn: '978-604-456-012-3', created_at: now, updated_at: now }, // PLCT001
            { book_id: bookIds[14], publisher_id: publisherIds[0], publish_year: 2021, isbn: '978-604-567-123-4', created_at: now, updated_at: now }  // KHXH001
        ];
        await queryInterface.bulkInsert('book_editions', bookEditions);

        // Lấy ID của các book editions
        const [allEditions] = await queryInterface.sequelize.query("SELECT id, book_id FROM book_editions ORDER BY id");
        const editionIds = allEditions.map(e => e.id);

        // ===================================================================
        // 16. TẠO BẢN SÁCH
        // ===================================================================
        const bookCopies = [];
        // Mỗi edition có 3-5 bản sách
        editionIds.forEach((editionId, editionIndex) => {
            const copyCount = editionIndex < 5 ? 5 : (editionIndex < 10 ? 4 : 3); // Một số sách có nhiều bản hơn
            const basePrice = 50000 + (editionIndex * 10000); // Giá từ 50k đến 200k
            for (let i = 1; i <= copyCount; i++) {
                let status = 'available';
                let conditionNotes = null;

                // Phân bổ trạng thái đa dạng hơn
                // Edition 0-3: một số bản đang mượn (để phù hợp với borrow_details - cần ít nhất 7 copies)
                if (editionIndex < 4 && i <= 2) {
                    status = 'borrowed';
                }
                // Edition 3-4: một số bản hỏng
                else if (editionIndex === 3 && i === copyCount) {
                    status = 'damaged';
                    conditionNotes = 'Bìa sách bị rách';
                }
                // Edition 5: một số bản hỏng và thanh lý
                else if (editionIndex === 5) {
                    if (i === copyCount) {
                        status = 'damaged';
                        conditionNotes = 'Bìa sách bị rách';
                    } else if (i === copyCount - 1) {
                        status = 'disposed';
                        conditionNotes = 'Thanh lý do hư hỏng nặng';
                    }
                }
                // Edition 6-7: một số bản thanh lý
                else if (editionIndex === 6 && i === copyCount) {
                    status = 'disposed';
                    conditionNotes = 'Thanh lý';
                }
                // Edition 8-9: một số bản hỏng
                else if (editionIndex === 8 && i === copyCount) {
                    status = 'damaged';
                    conditionNotes = 'Trang sách bị rách';
                }
                // Edition 10+: đa số available, một số hỏng
                else if (editionIndex >= 10 && i === copyCount && editionIndex % 2 === 0) {
                    status = 'damaged';
                    conditionNotes = 'Bìa sách bị mờ';
                }

                bookCopies.push({
                    book_edition_id: editionId,
                    copy_number: i,
                    price: basePrice,
                    status: status,
                    condition_notes: conditionNotes,
                    created_at: now,
                    updated_at: now
                });
            }
        });
        await queryInterface.bulkInsert('book_copies', bookCopies);

        // Lấy ID của các book copies
        const [allCopies] = await queryInterface.sequelize.query("SELECT id, book_edition_id, status FROM book_copies ORDER BY id");
        const copyIds = allCopies.map(c => c.id);
        // Lấy các copies theo trạng thái để sử dụng trong borrow_details
        const availableCopies = allCopies.filter(c => c.status === 'available').map(c => c.id);
        const borrowedCopies = allCopies.filter(c => c.status === 'borrowed').map(c => c.id);

        // ===================================================================
        // 17. TẠO PHIẾU MƯỢN
        // ===================================================================
        const borrowRequests = [];
        const requestDate1 = new Date('2024-01-15');
        const borrowDate1 = new Date('2024-01-16');
        const dueDate1 = new Date('2024-01-30');
        const requestDate2 = new Date('2024-01-20');
        const borrowDate2 = new Date('2024-01-21');
        const dueDate2 = new Date('2024-02-04');
        const requestDate3 = new Date('2024-01-25');
        const borrowDate3 = new Date('2024-01-26');
        const dueDate3 = new Date('2024-02-09');

        // Phiếu đã trả
        borrowRequests.push({
            library_card_id: cardIds[0],
            account_id: readerAccountIds[0],
            approved_by: librarianStaffId,
            request_date: requestDate1,
            borrow_date: borrowDate1,
            due_date: dueDate1,
            status: 'returned',
            notes: 'Đã trả đúng hạn',
            created_at: now,
            updated_at: now
        });

        // Phiếu đang mượn
        borrowRequests.push({
            library_card_id: cardIds[1],
            account_id: readerAccountIds[1],
            approved_by: librarianStaffId,
            request_date: requestDate2,
            borrow_date: borrowDate2,
            due_date: dueDate2,
            status: 'borrowed',
            notes: 'Đang mượn',
            created_at: now,
            updated_at: now
        });

        // Phiếu quá hạn
        const overdueDate = new Date('2024-01-10');
        borrowRequests.push({
            library_card_id: cardIds[2],
            account_id: readerAccountIds[2],
            approved_by: librarianStaffId,
            request_date: overdueDate,
            borrow_date: new Date('2024-01-11'),
            due_date: new Date('2024-01-25'),
            status: 'overdue',
            notes: 'Quá hạn trả',
            created_at: now,
            updated_at: now
        });

        // Phiếu chờ duyệt
        borrowRequests.push({
            library_card_id: cardIds[3],
            account_id: readerAccountIds[3],
            approved_by: null,
            request_date: new Date('2024-01-28'),
            borrow_date: null,
            due_date: new Date('2024-02-11'),
            status: 'pending',
            notes: 'Chờ duyệt',
            created_at: now,
            updated_at: now
        });

        // Phiếu đã duyệt nhưng chưa mượn
        borrowRequests.push({
            library_card_id: cardIds[4],
            account_id: readerAccountIds[4],
            approved_by: librarianStaffId,
            request_date: new Date('2024-01-27'),
            borrow_date: null,
            due_date: new Date('2024-02-10'),
            status: 'approved',
            notes: 'Đã duyệt, chờ lấy sách',
            created_at: now,
            updated_at: now
        });

        await queryInterface.bulkInsert('borrow_requests', borrowRequests);

        // Lấy ID của các borrow requests
        const [allBorrowRequests] = await queryInterface.sequelize.query("SELECT id, status FROM borrow_requests ORDER BY id");
        const borrowRequestIds = allBorrowRequests.map(br => br.id);

        // ===================================================================
        // 18. TẠO CHI TIẾT MƯỢN
        // ===================================================================
        const borrowDetails = [];
        // Phiếu 1 (đã trả) - 2 cuốn sách (sử dụng borrowed copies đầu tiên)
        if (borrowedCopies.length >= 2) {
            borrowDetails.push(
                { borrow_request_id: borrowRequestIds[0], book_copy_id: borrowedCopies[0], actual_return_date: new Date('2024-01-28'), return_condition: 'normal', notes: 'Trả đúng hạn, sách còn tốt', created_at: now, updated_at: now },
                { borrow_request_id: borrowRequestIds[0], book_copy_id: borrowedCopies[1], actual_return_date: new Date('2024-01-28'), return_condition: 'normal', notes: 'Trả đúng hạn', created_at: now, updated_at: now }
            );
        }
        // Phiếu 2 (đang mượn) - 3 cuốn sách (sử dụng borrowed copies tiếp theo)
        if (borrowedCopies.length >= 5) {
            borrowDetails.push(
                { borrow_request_id: borrowRequestIds[1], book_copy_id: borrowedCopies[2], actual_return_date: null, return_condition: null, notes: null, created_at: now, updated_at: now },
                { borrow_request_id: borrowRequestIds[1], book_copy_id: borrowedCopies[3], actual_return_date: null, return_condition: null, notes: null, created_at: now, updated_at: now },
                { borrow_request_id: borrowRequestIds[1], book_copy_id: borrowedCopies[4], actual_return_date: null, return_condition: null, notes: null, created_at: now, updated_at: now }
            );
        }
        // Phiếu 3 (quá hạn) - 2 cuốn sách (sử dụng borrowed copies tiếp theo)
        if (borrowedCopies.length >= 7) {
            borrowDetails.push(
                { borrow_request_id: borrowRequestIds[2], book_copy_id: borrowedCopies[5], actual_return_date: null, return_condition: null, notes: 'Quá hạn', created_at: now, updated_at: now },
                { borrow_request_id: borrowRequestIds[2], book_copy_id: borrowedCopies[6], actual_return_date: null, return_condition: null, notes: 'Quá hạn', created_at: now, updated_at: now }
            );
        }
        await queryInterface.bulkInsert('borrow_details', borrowDetails);

        // ===================================================================
        // 19. TẠO PHIẾU PHẠT
        // ===================================================================
        // Phạt cho phiếu quá hạn (borrowRequestIds[2])
        const overdueDays = Math.floor((now - new Date('2024-01-25')) / (1000 * 60 * 60 * 24));
        const fineAmount1 = Math.round(50000 * 0.1 * overdueDays); // 10% giá sách x số ngày
        const fineAmount2 = Math.round(60000 * 0.1 * overdueDays);
        const fines = [
            {
                borrow_request_id: borrowRequestIds[2],
                book_copy_id: copyIds[5],
                reason: 'Trả sách quá hạn',
                amount: fineAmount1,
                status: 'pending',
                paid_date: null,
                collected_by: null,
                created_at: now,
                updated_at: now
            },
            {
                borrow_request_id: borrowRequestIds[2],
                book_copy_id: copyIds[6],
                reason: 'Trả sách quá hạn',
                amount: fineAmount2,
                status: 'pending',
                paid_date: null,
                collected_by: null,
                created_at: now,
                updated_at: now
            }
        ];
        await queryInterface.bulkInsert('fines', fines);

        // ===================================================================
        // 20. TẠO PHIẾU NHẮC TRẢ
        // ===================================================================
        const reminders = [];
        if (fines.length >= 2) {
            const totalFine = fines.reduce((sum, f) => sum + f.amount, 0);
            reminders.push({
                borrow_request_id: borrowRequestIds[2],
                sent_date: new Date('2024-01-26'), // Thứ 6
                content: `Nhắc trả sách quá hạn:\n- Ngày hẹn trả: 25/01/2024\n- Số ngày quá hạn: ${overdueDays} ngày\n- Tổng tiền phạt dự kiến: ${totalFine.toLocaleString('vi-VN')} VND`,
                estimated_fine: totalFine,
                created_at: now,
                updated_at: now
            });
        }
        if (reminders.length > 0) {
            await queryInterface.bulkInsert('reminders', reminders);
        }

        console.log('✅ Seed data created successfully!');
    },

    async down(queryInterface, Sequelize) {
        // Xóa dữ liệu theo thứ tự ngược lại (từ bảng con đến bảng cha)
        await queryInterface.bulkDelete('reminders', null, {});
        await queryInterface.bulkDelete('fines', null, {});
        await queryInterface.bulkDelete('borrow_details', null, {});
        await queryInterface.bulkDelete('borrow_requests', null, {});
        await queryInterface.bulkDelete('deposit_transactions', null, {});
        await queryInterface.bulkDelete('library_cards', null, {});
        await queryInterface.bulkDelete('readers', null, {});
        await queryInterface.bulkDelete('book_copies', null, {});
        await queryInterface.bulkDelete('book_editions', null, {});
        await queryInterface.bulkDelete('book_authors', null, {});
        await queryInterface.bulkDelete('books', null, {});
        await queryInterface.bulkDelete('authors', null, {});
        await queryInterface.bulkDelete('publishers', null, {});
        await queryInterface.bulkDelete('genres', null, {});
        await queryInterface.bulkDelete('fields', null, {});
        await queryInterface.bulkDelete('system_settings', null, {});
        await queryInterface.bulkDelete('staffs', null, {});
        await queryInterface.bulkDelete('accounts', null, {});
        await queryInterface.bulkDelete('user_groups', null, {});

        console.log('✅ Seed data removed successfully!');
    }
};
