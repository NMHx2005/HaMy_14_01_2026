/**
 * ===================================================================
 * RETURN BOOK MODAL - Modal trả sách
 * ===================================================================
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import Modal from '../Modal';
import { HiOutlineBookOpen, HiOutlineCheck } from 'react-icons/hi';

const ReturnBookModal = ({ isOpen, onClose, onConfirm, borrowRequest, loading = false }) => {
    // Tính toán initial items từ borrowRequest - dependency là borrowRequest để khớp với React Compiler
    const initialItems = useMemo(() => {
        if (!borrowRequest?.details) return [];
        return borrowRequest.details
            .filter(d => !d.actual_return_date)
            .map(d => ({
                book_copy_id: d.book_copy_id,
                bookTitle: d.bookCopy?.bookEdition?.book?.title || 'Sách không rõ',
                bookCode: d.bookCopy?.bookEdition?.book?.code || '',
                selected: true,
                return_condition: 'normal', // Sửa từ 'good' thành 'normal' để khớp với backend
                notes: ''
            }));
    }, [borrowRequest]);

    const prevRequestIdRef = useRef(null);
    const [returnItems, setReturnItems] = useState(() => initialItems);

    // Reset state khi modal mở với borrowRequest mới
    // Note: setState trong useEffect là cần thiết để sync state khi props thay đổi
    useEffect(() => {
        const currentRequestId = borrowRequest?.id;
        if (isOpen && currentRequestId !== prevRequestIdRef.current) {
            prevRequestIdRef.current = currentRequestId;
            setReturnItems(initialItems);
        } else if (!isOpen) {
            prevRequestIdRef.current = null;
            setReturnItems([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, borrowRequest?.id, initialItems]);

    const handleToggleItem = (bookCopyId) => {
        setReturnItems(prev => prev.map(item =>
            item.book_copy_id === bookCopyId
                ? { ...item, selected: !item.selected }
                : item
        ));
    };

    const handleConditionChange = (bookCopyId, condition) => {
        setReturnItems(prev => prev.map(item =>
            item.book_copy_id === bookCopyId
                ? { ...item, return_condition: condition }
                : item
        ));
    };

    const handleNotesChange = (bookCopyId, notes) => {
        setReturnItems(prev => prev.map(item =>
            item.book_copy_id === bookCopyId
                ? { ...item, notes }
                : item
        ));
    };

    const handleSubmit = () => {
        const selectedItems = returnItems
            .filter(item => item.selected)
            .map(({ book_copy_id, return_condition, notes }) => ({
                book_copy_id,
                return_condition,
                notes
            }));

        if (selectedItems.length === 0) return;
        onConfirm(selectedItems);
    };

    const conditionOptions = [
        { value: 'normal', label: 'Bình thường', color: 'bg-green-100 text-green-800' },
        { value: 'damaged', label: 'Hư hỏng', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'lost', label: 'Mất sách', color: 'bg-red-100 text-red-800' }
    ];

    const selectedCount = returnItems.filter(i => i.selected).length;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Trả sách" size="lg">
            <div className="space-y-4">
                {returnItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <HiOutlineBookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Không còn sách nào chưa trả</p>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-gray-600">
                            Chọn sách cần trả và tình trạng trả:
                        </p>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {returnItems.map((item) => (
                                <div
                                    key={item.book_copy_id}
                                    className={`p-4 rounded-xl border-2 transition-all ${item.selected
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleItem(item.book_copy_id)}
                                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${item.selected
                                                ? 'bg-black text-white'
                                                : 'border-2 border-gray-300'
                                                }`}
                                        >
                                            {item.selected && <HiOutlineCheck className="w-4 h-4" />}
                                        </button>

                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{item.bookTitle}</p>
                                            <p className="text-sm text-gray-500">Mã: {item.bookCode}</p>

                                            {item.selected && (
                                                <div className="mt-3 space-y-3">
                                                    <div className="flex gap-2 flex-wrap">
                                                        {conditionOptions.map(opt => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => handleConditionChange(item.book_copy_id, opt.value)}
                                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${item.return_condition === opt.value
                                                                    ? opt.color + ' ring-2 ring-offset-1 ring-gray-400'
                                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {item.return_condition !== 'normal' && (
                                                        <input
                                                            type="text"
                                                            value={item.notes}
                                                            onChange={(e) => handleNotesChange(item.book_copy_id, e.target.value)}
                                                            placeholder="Ghi chú tình trạng..."
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading || selectedCount === 0}
                                className="flex-1 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center justify-center gap-2 disabled:bg-gray-300"
                            >
                                {loading && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                Trả {selectedCount} sách
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default ReturnBookModal;
