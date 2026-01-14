/**
 * ===================================================================
 * HEADER COMPONENT - Thanh tiêu đề phía trên (Theo Figma Design)
 * ===================================================================
 * Height: 71px (theo Figma)
 * Background: #FFFFFF (trắng)
 * Layout:
 * - Trái: User icon + Tên + Role
 * - Phải: Giờ + Ngày | Icon Settings
 * ===================================================================
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HiOutlineUser, HiOutlineCog } from 'react-icons/hi';

/**
 * Header Component
 * Thanh tiêu đề với thông tin user và thời gian
 */
const Header = ({ title }) => {
    const { user } = useAuth();

    // State cho thời gian hiện tại
    const [currentTime, setCurrentTime] = useState(new Date());

    // Cập nhật thời gian mỗi giây
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    /**
     * Format thời gian theo định dạng "hh:mm AM/PM"
     */
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    /**
     * Format ngày theo định dạng "Thứ X, DD/MM/YYYY"
     */
    const formatDate = (date) => {
        const days = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        const day = days[date.getDay()];
        const dateNum = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}, ${dateNum}/${month}/${year}`;
    };

    /**
     * Lấy tên hiển thị của user
     */
    const getUserDisplayName = () => {
        if (user?.staff?.full_name) return user.staff.full_name;
        if (user?.reader?.full_name) return user.reader.full_name;
        return user?.username || 'User';
    };

    /**
     * Lấy role hiển thị
     */
    const getRoleDisplay = () => {
        if (user?.role === 'admin') return 'Admin';
        if (user?.role === 'librarian') return 'Thủ thư';
        return 'Độc giả';
    };

    return (
        // Header container: height 71px theo Figma
        <header
            className="bg-white flex items-center justify-between px-5"
            style={{ height: '71px' }}
        >
            {/* ===== LEFT SECTION: User Info ===== */}
            {/* Position: x=20 theo Figma */}
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                {/* User Icon: 34x34 */}
                <div className="w-9 h-9 flex items-center justify-center">
                    <HiOutlineUser className="w-8 h-8 text-black" />
                </div>

                {/* User Name & Role */}
                <div>
                    {/* Name: x=61, y=16 */}
                    <p className="text-lg font-semibold text-black leading-tight">
                        {getUserDisplayName()}
                    </p>
                    {/* Role: x=61, y=38 */}
                    <p className="text-sm text-black leading-tight">
                        {getRoleDisplay()}
                    </p>
                </div>
            </Link>

            {/* ===== RIGHT SECTION: Time, Date & Settings ===== */}
            <div className="flex items-center gap-4">
                {/* Time & Date */}
                <div className="text-right">
                    {/* Time: 12:29 PM */}
                    <p className="text-lg font-semibold text-black leading-tight">
                        {formatTime(currentTime)}
                    </p>
                    {/* Date: Jan 02, 2026 */}
                    <p className="text-sm text-black leading-tight">
                        {formatDate(currentTime)}
                    </p>
                </div>

                {/* Divider Line: x=1635, vertical */}
                <div className="w-0.5 h-14 bg-black"></div>

                {/* Settings Icon: 38x38 */}
                <Link
                    to="/settings"
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <HiOutlineCog className="w-8 h-8 text-black" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
