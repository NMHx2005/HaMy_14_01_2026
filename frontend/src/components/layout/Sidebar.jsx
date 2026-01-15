/**
 * ===================================================================
 * SIDEBAR COMPONENT - Thanh điều hướng bên trái (Theo Figma Design)
 * ===================================================================
 * Width: 222px (theo Figma)
 * Background: #000000 (đen)
 * Menu items: 48px height mỗi item
 * Active state: bg-white, text-black
 * ===================================================================
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    HiOutlineHome,           // Trang chủ
    HiOutlineBookOpen,       // Mượn trả
    HiOutlineCollection,     // Sách
    HiOutlineUserGroup,      // Thành viên
    HiOutlineOfficeBuilding, // Điều hành
    HiOutlineLogout,         // Đăng xuất
    HiOutlineChartBar,       // Thống kê
    HiOutlineCog,            // Cài đặt
    HiOutlineCurrencyDollar, // Tài chính
    HiOutlineUser,           // Hồ sơ cá nhân
    HiOutlineBell,           // Thông báo
    HiOutlineTag             // Danh mục
} from 'react-icons/hi';

// Import logo SVG
import Logo from '../../assets/logo.svg';

/**
 * Sidebar Component
 * Thanh điều hướng bên trái với menu items theo role
 * Kích thước: 222px x 100vh (theo Figma)
 */
const Sidebar = () => {
    const { user, logout, isAdmin, isStaff, isReader } = useAuth();
    const navigate = useNavigate();

    /**
     * Xử lý đăng xuất
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    /**
     * Menu items cho Admin/Librarian (Staff)
     * Thứ tự: Trang chủ → Mượn trả → Sách → Danh mục → Thành viên → Tài chính → Báo cáo
     */
    const staffMenuItems = [
        {
            path: '/dashboard',
            icon: HiOutlineHome,
            label: 'Trang chủ',
        },
        {
            path: '/borrowing',
            icon: HiOutlineBookOpen,
            label: 'Mượn & Trả',
        },
        {
            path: '/books',
            icon: HiOutlineCollection,
            label: 'Sách',
        },
        {
            path: '/categories',
            icon: HiOutlineTag,
            label: 'Danh mục',
        },
        {
            path: '/members',
            icon: HiOutlineUserGroup,
            label: 'Thành viên',
        },
        {
            path: '/finance',
            icon: HiOutlineCurrencyDollar,
            label: 'Tài chính',
        },
        {
            path: '/statistics',
            icon: HiOutlineChartBar,
            label: 'Báo cáo',
        },
        {
            path: '/notifications',
            icon: HiOutlineBell,
            label: 'Thông báo',
        },
        {
            path: '/profile',
            icon: HiOutlineUser,
            label: 'Hồ sơ',
        },
    ];

    /**
     * Menu items chỉ dành cho Admin (Điều hành + Cài đặt)
     */
    const adminOnlyItems = [
        {
            path: '/operations',
            icon: HiOutlineOfficeBuilding,
            label: 'Điều hành',
        },
        {
            path: '/settings',
            icon: HiOutlineCog,
            label: 'Cài đặt',
        },
    ];

    /**
     * Menu items cho Reader (Độc giả)
     */
    const readerMenuItems = [
        {
            path: '/dashboard',
            icon: HiOutlineHome,
            label: 'Trang chủ',
        },
        {
            path: '/my-books',
            icon: HiOutlineBookOpen,
            label: 'Mượn & Trả',
        },
        {
            path: '/search',
            icon: HiOutlineCollection,
            label: 'Tìm sách',
        },
        {
            path: '/my-finance',
            icon: HiOutlineCurrencyDollar,
            label: 'Tài chính',
        },
        {
            path: '/profile',
            icon: HiOutlineUser,
            label: 'Hồ sơ',
        },
    ];

    // Chọn menu items dựa trên role
    let menuItems = [];

    if (isStaff()) {
        menuItems = [...staffMenuItems];
        if (isAdmin()) {
            menuItems = [...menuItems, ...adminOnlyItems];
        }
    } else if (isReader()) {
        menuItems = readerMenuItems;
    }

    return (
        // Sidebar container: width tương đối theo rem, rộng rãi hơn
        <aside
            className="h-screen flex flex-col fixed left-0 top-0 z-50 bg-gradient-to-b from-gray-900 via-black to-black shadow-2xl w-[16rem] min-w-[16rem]"
        >
            {/* ===== LOGO SECTION ===== */}
            {/* Position: x=35, y=36, size: 152x91 theo Figma */}
            <div className="pt-8 pb-6 px-6 border-b border-gray-800/50">
                <div className="transform transition-transform duration-300 hover:scale-105 flex justify-center items-center">
                    <img
                        src={Logo}
                        alt="BookWorm Library"
                        className="w-full max-w-[11rem] h-auto drop-shadow-lg"
                    />
                </div>
            </div>

            {/* ===== NAVIGATION MENU ===== */}
            {/* Bắt đầu từ y=158 theo Figma */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center h-[3rem] px-5 gap-4 rounded-xl transition-all duration-200 relative ${isActive
                                        ? 'bg-white text-black shadow-lg shadow-white/20 font-medium'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:translate-x-1'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active indicator bar */}
                                        {isActive && (
                                            <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                                        )}

                                        {/* Icon: size tương đối, lớn hơn */}
                                        <item.icon
                                            className={`w-6 h-6 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                                                }`}
                                        />

                                        {/* Label */}
                                        <span className="text-sm font-medium tracking-wide">
                                            {item.label}
                                        </span>

                                        {/* Hover effect indicator */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ===== USER INFO ===== */}
            <div className="px-5 py-5 border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-800/50 transition-colors duration-200">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 shadow-lg ring-2 ring-gray-700/50">
                        <span className="text-white font-semibold text-base">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-900" />
                    </div>

                    {/* Name & Role */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                            {user?.staff?.full_name || user?.reader?.full_name || user?.username}
                        </p>
                        <p className="text-gray-400 text-xs font-medium mt-0.5">
                            {user?.role === 'admin' ? 'Quản Trị Viên' :
                                user?.role === 'librarian' ? 'Thủ Thư' : 'Độc Giả'}
                        </p>
                    </div>
                </div>
            </div>

            {/* ===== LOGOUT BUTTON ===== */}
            {/* Position: y=931 (gần đáy) theo Figma */}
            <div className="px-4 pb-5 pt-4 border-t border-gray-800/50">
                <button
                    onClick={handleLogout}
                    className="group flex items-center h-[3rem] px-5 gap-4 w-full rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 relative overflow-hidden"
                >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    {/* Icon */}
                    <HiOutlineLogout className="w-6 h-6 shrink-0 relative z-10 transform group-hover:rotate-12 transition-transform duration-200" />

                    {/* Label */}
                    <span className="text-sm font-medium tracking-wide relative z-10">
                        Đăng xuất
                    </span>

                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-xl border border-red-500/0 group-hover:border-red-500/30 transition-colors duration-200" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
