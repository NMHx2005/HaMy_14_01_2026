/**
 * ===================================================================
 * MAIN LAYOUT - Layout chính cho các trang sau khi đăng nhập
 * ===================================================================
 * Cấu trúc:
 * - Sidebar cố định bên trái
 * - Content area bên phải (header + main content)
 * ===================================================================
 */

import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Mapping path -> page title
 */
const pageTitles = {
    '/dashboard': 'Trang chủ',
    '/borrowing': 'Quản lý Mượn & Trả',
    '/books': 'Quản lý Sách',
    '/members': 'Quản lý Thành viên',
    '/finance': 'Quản lý Tài chính',
    '/statistics': 'Thống kê',
    '/settings': 'Cài đặt hệ thống',
    '/my-books': 'Sách của tôi',
    '/my-finance': 'Tài chính cá nhân',
    '/search': 'Tìm kiếm sách',
};

/**
 * MainLayout Component
 * Layout wrapper cho tất cả các trang sau khi đăng nhập
 */
const MainLayout = () => {
    const location = useLocation();

    // Lấy title dựa trên path hiện tại
    const getPageTitle = () => {
        // Kiểm tra exact match trước
        if (pageTitles[location.pathname]) {
            return pageTitles[location.pathname];
        }

        // Kiểm tra partial match (cho nested routes)
        for (const [path, title] of Object.entries(pageTitles)) {
            if (location.pathname.startsWith(path)) {
                return title;
            }
        }

        return 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ===== SIDEBAR ===== */}
            <Sidebar />

            {/* ===== MAIN CONTENT AREA ===== */}
            {/* margin-left: 16rem (256px) để khớp với sidebar width */}
            <div style={{ marginLeft: '16rem' }} className="min-h-screen w-[calc(100%-16rem)] overflow-x-hidden">
                {/* Header */}
                <Header title={getPageTitle()} />

                {/* Page Content */}
                <main className="p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
                    {/* Outlet sẽ render component của route hiện tại */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
