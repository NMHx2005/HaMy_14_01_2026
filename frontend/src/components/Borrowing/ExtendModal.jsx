/**
 * ===================================================================
 * EXTEND MODAL - Modal gia hạn phiếu mượn
 * ===================================================================
 */

import { useState } from 'react';
import Modal from '../Modal';
import { HiOutlineCalendar } from 'react-icons/hi';

const ExtendModal = ({ isOpen, onClose, onConfirm, borrowRequest, loading = false }) => {
    const [newDueDate, setNewDueDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newDueDate) return;
        onConfirm(newDueDate, notes);
    };

    // Get minimum date (tomorrow)
    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        return today.toISOString().split('T')[0];
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gia hạn phiếu mượn" size="sm">
            <form onSubmit={handleSubmit} className="space-y-5">
                {borrowRequest && (
                    <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500">Phiếu mượn</p>
                        <p className="font-semibold text-gray-900">#{borrowRequest.id}</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Hạn hiện tại: {new Date(borrowRequest.due_date).toLocaleDateString('vi-VN')}
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <HiOutlineCalendar className="inline w-4 h-4 mr-1" />
                        Ngày hạn mới
                    </label>
                    <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        min={getMinDate()}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú (tùy chọn)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Lý do gia hạn..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !newDueDate}
                        className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        Gia hạn
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ExtendModal;
