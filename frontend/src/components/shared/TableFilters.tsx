type FilterField = {
    label: string;
    type: 'select' | 'date' | 'text';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onDebounce?: (value: string) => void;
    options?: { value: string; label: string }[];
}

type TableFiltersProps = {
    filters: FilterField[];
    onClear: () => void;
    showClearButton?: boolean;
}

export default function TableFilters({ filters, onClear, showClearButton }: TableFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex flex-col sm:flex-row gap-3 shadow-sm justify-between bg-white rounded-lg p-3 w-full">
                {filters.map((filter) => (
                    <div key={filter.label} className="flex flex-col gap-1 px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50">
                        <label className="text-xs font-bold text-gray-600">{filter.label}</label>
                        {filter.type === 'select' ? (
                            <select
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="text-sm focus:outline-none"
                            >
                                {filter.options?.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : filter.type === 'date' ? (
                            <input
                                type="date"
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="text-sm focus:outline-none"
                            />
                        ) : (
                            <input
                                type="text"
                                placeholder={filter.placeholder}
                                value={filter.value}
                                onChange={(e) => filter.onChange(e.target.value)}
                                className="text-sm focus:outline-none"
                            />
                        )}
                    </div>
                ))}
                {showClearButton && (
                    <div className="flex items-end">
                        <button
                            onClick={onClear}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer text-white text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
