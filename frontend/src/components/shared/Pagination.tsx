type PaginationProps = {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  label: string;
  totalItems: number;
};

export default function Pagination({
  page,
  totalPages,
  handlePageChange,
  label,
  totalItems,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm text-gray-500">
        Total: {totalItems} {label}
        <span className="ml-2">
          Página {page} de {totalPages}
        </span>
      </p>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Anterior
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
