interface PaginationProps {
  currentPage: number
  totalPages: number
  pageSize: number
  totalElements: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const start = currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, totalElements)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i)
    } else {
      pages.push(0)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages - 2, currentPage + 2); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 4) pages.push('...')
      pages.push(totalPages - 1)
    }
    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      {/* Thông tin + chọn số sản phẩm/trang */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>Hiển thị {start}–{end} / {totalElements} sản phẩm</span>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-2">
          <span>Mỗi trang:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value))
              onPageChange(0)
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-600"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Nút phân trang */}
      <div className="flex items-center gap-1">
        {/* Nút đầu */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Trang đầu"
        >
          «
        </button>
        {/* Nút lùi */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ‹
        </button>

        {/* Số trang */}
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-400 text-sm">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {(page as number) + 1}
            </button>
          )
        )}

        {/* Nút tiến */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ›
        </button>
        {/* Nút cuối */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-2 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Trang cuối"
        >
          »
        </button>
      </div>
    </div>
  )
}