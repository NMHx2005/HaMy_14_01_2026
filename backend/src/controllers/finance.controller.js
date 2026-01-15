/**
 * ===================================================================
 * CONTROLLER: TÀI CHÍNH (Finance Controller)
 * ===================================================================
 * Xử lý nghiệp vụ tài chính:
 * - Tiền phạt (Fine)
 * - Tiền đặt cọc (Deposit)
 * ===================================================================
 */

const {
    Fine, DepositTransaction, LibraryCard, Reader, Staff,
    BorrowRequest, BookCopy, BookEdition, Book,
    sequelize
} = require('../models');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

// ===================================================================
// FINE (Tiền phạt) CONTROLLERS
// ===================================================================

/**
 * @desc    Lấy danh sách tiền phạt
 * @route   GET /api/fines
 * @access  Admin, Librarian
 */
const getFines = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows } = await Fine.findAndCountAll({
        where,
        include: [
            {
                model: BorrowRequest,
                as: 'borrowRequest',
                include: [{
                    model: LibraryCard,
                    as: 'libraryCard',
                    include: [{
                        model: Reader,
                        as: 'reader',
                        attributes: ['id', 'full_name', 'phone']
                    }]
                }]
            },
            {
                model: BookCopy,
                as: 'bookCopy',
                include: [{
                    model: BookEdition,
                    as: 'bookEdition',
                    include: [{ model: Book, as: 'book', attributes: ['id', 'title'] }]
                }]
            },
            {
                model: Staff,
                as: 'collector',
                attributes: ['id', 'full_name']
            }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
    });

    // Tính tổng tiền phạt
    const totalPending = await Fine.sum('amount', { where: { status: 'pending' } });
    const totalPaid = await Fine.sum('amount', { where: { status: 'paid' } });

    res.json({
        success: true,
        data: rows,
        summary: {
            totalPending: totalPending || 0,
            totalPaid: totalPaid || 0
        },
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    });
});

/**
 * @desc    Lấy tiền phạt của tôi (độc giả)
 * @route   GET /api/fines/my
 * @access  Reader
 */
const getMyFines = asyncHandler(async (req, res) => {
    const reader = await Reader.findOne({
        where: { account_id: req.user.id },
        include: [{ model: LibraryCard, as: 'libraryCard' }]
    });

    if (!reader || !reader.libraryCard) {
        return res.json({
            success: true,
            data: [],
            summary: { total: 0, pending: 0, paid: 0 }
        });
    }

    const fines = await Fine.findAll({
        include: [
            {
                model: BorrowRequest,
                as: 'borrowRequest',
                where: { library_card_id: reader.libraryCard.id }
            },
            {
                model: BookCopy,
                as: 'bookCopy',
                include: [{
                    model: BookEdition,
                    as: 'bookEdition',
                    include: [{ model: Book, as: 'book', attributes: ['id', 'title'] }]
                }]
            }
        ],
        order: [['created_at', 'DESC']]
    });

    const pending = fines.filter(f => f.status === 'pending')
        .reduce((sum, f) => sum + parseFloat(f.amount), 0);
    const paid = fines.filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + parseFloat(f.amount), 0);

    res.json({
        success: true,
        data: fines,
        summary: {
            total: fines.length,
            pending,
            paid
        }
    });
});

/**
 * @desc    Thanh toán tiền phạt
 * @route   PUT /api/fines/:id/pay
 * @access  Admin, Librarian
 */
const payFine = asyncHandler(async (req, res) => {
    const fine = await Fine.findByPk(req.params.id);

    if (!fine) {
        throw new AppError('Không tìm thấy phiếu phạt', 404);
    }

    if (fine.status === 'paid') {
        throw new AppError('Phiếu phạt đã được thanh toán', 400);
    }

    const staff = await Staff.findOne({ where: { account_id: req.user.id } });

    await fine.update({
        status: 'paid',
        paid_date: new Date(),
        collected_by: staff?.id
    });

    res.json({
        success: true,
        message: 'Thanh toán tiền phạt thành công',
        data: fine
    });
});

/**
 * @desc    Thanh toán tất cả tiền phạt của một phiếu mượn
 * @route   PUT /api/fines/pay-all/:borrowRequestId
 * @access  Admin, Librarian
 */
const payAllFines = asyncHandler(async (req, res) => {
    const { borrowRequestId } = req.params;

    const staff = await Staff.findOne({ where: { account_id: req.user.id } });

    const [updatedCount] = await Fine.update(
        {
            status: 'paid',
            paid_date: new Date(),
            collected_by: staff?.id
        },
        {
            where: {
                borrow_request_id: borrowRequestId,
                status: 'pending'
            }
        }
    );

    res.json({
        success: true,
        message: `Đã thanh toán ${updatedCount} phiếu phạt`
    });
});

// ===================================================================
// DEPOSIT (Tiền đặt cọc) CONTROLLERS
// ===================================================================

/**
 * @desc    Lấy danh sách giao dịch cọc
 * @route   GET /api/deposits
 * @access  Admin, Librarian
 */
const getDeposits = asyncHandler(async (req, res) => {
    const { type, library_card_id, page = 1, limit = 20 } = req.query;

    const where = {};
    if (type) where.type = type;
    if (library_card_id) where.library_card_id = library_card_id;

    const offset = (page - 1) * limit;

    const { count, rows } = await DepositTransaction.findAndCountAll({
        where,
        include: [
            {
                model: LibraryCard,
                as: 'libraryCard',
                include: [{
                    model: Reader,
                    as: 'reader',
                    attributes: ['id', 'full_name', 'id_card_number']
                }]
            },
            {
                model: Staff,
                as: 'staff',
                attributes: ['id', 'full_name']
            }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset
    });

    res.json({
        success: true,
        data: rows,
        pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        }
    });
});

/**
 * @desc    Lấy giao dịch cọc của tôi (độc giả)
 * @route   GET /api/deposits/my
 * @access  Reader
 */
const getMyDeposits = asyncHandler(async (req, res) => {
    const reader = await Reader.findOne({
        where: { account_id: req.user.id },
        include: [{ model: LibraryCard, as: 'libraryCard' }]
    });

    if (!reader || !reader.libraryCard) {
        return res.json({
            success: true,
            data: [],
            balance: 0
        });
    }

    const deposits = await DepositTransaction.findAll({
        where: { library_card_id: reader.libraryCard.id },
        include: [{
            model: Staff,
            as: 'staff',
            attributes: ['id', 'full_name']
        }],
        order: [['created_at', 'DESC']]
    });

    // Tính số dư
    const balance = deposits.reduce((sum, d) => {
        if (d.type === 'deposit') return sum + parseFloat(d.amount);
        if (d.type === 'refund') return sum - parseFloat(d.amount);
        return sum;
    }, 0);

    res.json({
        success: true,
        data: deposits,
        balance
    });
});

/**
 * @desc    Nạp tiền cọc
 * @route   POST /api/deposits
 * @access  Admin, Librarian
 */
const createDeposit = asyncHandler(async (req, res) => {
    const { library_card_id, amount, notes } = req.body;

    // Kiểm tra thẻ thư viện
    const libraryCard = await LibraryCard.findByPk(library_card_id);
    if (!libraryCard) {
        throw new AppError('Không tìm thấy thẻ thư viện', 404);
    }

    const staff = await Staff.findOne({ where: { account_id: req.user.id } });
    if (!staff) {
        throw new AppError('Không tìm thấy thông tin nhân viên', 404);
    }

    const transaction = await DepositTransaction.create({
        library_card_id,
        staff_id: staff.id,
        amount,
        type: 'deposit',
        transaction_date: new Date(),
        notes
    });

    // Cập nhật tiền cọc trong thẻ
    await libraryCard.update({
        deposit_amount: parseFloat(libraryCard.deposit_amount) + parseFloat(amount)
    });

    res.status(201).json({
        success: true,
        message: 'Nạp tiền cọc thành công',
        data: transaction
    });
});

/**
 * @desc    Hoàn tiền cọc
 * @route   POST /api/deposits/refund
 * @access  Admin, Librarian
 */
const refundDeposit = asyncHandler(async (req, res) => {
    const { library_card_id, amount, notes } = req.body;

    // Kiểm tra thẻ thư viện
    const libraryCard = await LibraryCard.findByPk(library_card_id, {
        include: [{ model: Reader, as: 'reader' }]
    });

    if (!libraryCard) {
        throw new AppError('Không tìm thấy thẻ thư viện', 404);
    }

    // Kiểm tra số dư cọc
    if (parseFloat(libraryCard.deposit_amount) < parseFloat(amount)) {
        throw new AppError('Số tiền hoàn trả vượt quá số tiền cọc', 400);
    }

    // Kiểm tra có sách đang mượn không
    const activeBorrows = await BorrowRequest.count({
        where: {
            library_card_id,
            status: { [Op.in]: ['borrowed', 'overdue'] }
        }
    });

    if (activeBorrows > 0) {
        throw new AppError('Không thể hoàn tiền cọc khi còn sách đang mượn', 400);
    }

    // Kiểm tra có tiền phạt chưa thanh toán không
    const pendingFines = await Fine.count({
        where: { status: 'pending' },
        include: [{
            model: BorrowRequest,
            as: 'borrowRequest',
            where: { library_card_id }
        }]
    });

    if (pendingFines > 0) {
        throw new AppError('Vui lòng thanh toán hết tiền phạt trước khi hoàn cọc', 400);
    }

    const staff = await Staff.findOne({ where: { account_id: req.user.id } });

    const transaction = await DepositTransaction.create({
        library_card_id,
        staff_id: staff.id,
        amount,
        type: 'refund',
        transaction_date: new Date(),
        notes: notes || 'Hoàn trả tiền cọc'
    });

    // Cập nhật tiền cọc trong thẻ
    await libraryCard.update({
        deposit_amount: parseFloat(libraryCard.deposit_amount) - parseFloat(amount)
    });

    res.json({
        success: true,
        message: 'Hoàn tiền cọc thành công',
        data: transaction
    });
});

/**
 * @desc    Xóa phiếu phạt (Admin only)
 * @route   DELETE /api/fines/:id
 * @access  Admin
 */
const deleteFine = asyncHandler(async (req, res) => {
    const fine = await Fine.findByPk(req.params.id);

    if (!fine) {
        throw new AppError('Không tìm thấy phiếu phạt', 404);
    }

    // Chỉ cho phép xóa phiếu chưa thanh toán
    if (fine.status === 'paid') {
        throw new AppError('Không thể xóa phiếu phạt đã thanh toán', 400);
    }

    await fine.destroy();

    res.json({
        success: true,
        message: 'Xóa phiếu phạt thành công'
    });
});

module.exports = {
    // Fine
    getFines,
    getMyFines,
    payFine,
    payAllFines,
    deleteFine,

    // Deposit
    getDeposits,
    getMyDeposits,
    createDeposit,
    refundDeposit
};
