import { useMemo } from "react";
import { Trash2, Pencil } from "lucide-react";
import type { Slot, SlotsData } from "../../../types";
import { Link } from "react-router-dom";
import { useSlotsMutations } from "../../../hooks/slots/useSlotsMutations";
import { formatDay, formatDate, formatTime } from "../../../utils/formatDayAndDates";
import { useSlotsFilters } from "../../../hooks/slots/useSlotsFilters";
import TableFilters from "../../shared/TableFilters";


type SlotsTableProps = {
    data: SlotsData,
    page: number
    handlePageChange: (newPage: number) => void
}

export default function SlotsTable({ data, page, handlePageChange }: SlotsTableProps) {

    const { deleteSlotMutation } = useSlotsMutations();

    const { statusFilter, dayFilter, dateFilter, handleDayFilterChange, handleDateFilterChange, handleCleanFilters, handleStatusFilterChange } = useSlotsFilters();

    const filteredSlots: Slot[] = useMemo(() => {
        return data.slots.filter(slot => {
            if (statusFilter === "available" && !slot.is_available) return false;
            if (statusFilter === "booked" && slot.is_available) return false;
            if (dateFilter && slot.date !== dateFilter) return false;
            if (dayFilter && slot.schedule.day_of_week !== dayFilter) return false;
            return true;
        });
    }, [data.slots, statusFilter, dateFilter, dayFilter]);

    const hasNoResults = filteredSlots.length === 0;

    const filters = [
        { label: "Estado", type: "select" as const, value: statusFilter, onChange: handleStatusFilterChange, options: [{ value: "", label: "Todos los estados" }, { value: "available", label: "Disponible" }, { value: "booked", label: "Ocupado" }] },
        { label: "Fecha", type: "date" as const, value: dateFilter, onChange: handleDateFilterChange },
        { label: "Día", type: "select" as const, value: dayFilter, onChange: handleDayFilterChange, options: [{ value: "", label: "Todos los días" }, { value: "monday", label: "Lunes" }, { value: "tuesday", label: "Martes" }, { value: "wednesday", label: "Miércoles" }, { value: "thursday", label: "Jueves" }, { value: "friday", label: "Viernes" }, { value: "saturday", label: "Sábado" }, { value: "sunday", label: "Domingo" }] }
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <TableFilters filters={filters} onClear={handleCleanFilters} showClearButton={true} />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {hasNoResults ? (
                    <p className="text-center text-gray-500 py-4">No se encontraron registros</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">ID</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Hora inicio</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Hora fin</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Fecha Correspondiente y Día</th>
                                    <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSlots.map((slot) => (
                                    <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{slot.id.split('-')[0]}...</td>

                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {slot.start_time ? formatTime(slot.start_time) : '-'}
                                        </td>


                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {slot.end_time ? formatTime(slot.end_time) : '-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slot.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {slot.is_available ? 'Disponible' : 'Ocupado'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                            {slot.date ? formatDate(slot.date) + ' - ' + formatDay(slot.schedule.day_of_week) : '-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link to={`/dashboard/doctor/slots/edit/${slot.id}`} className="p-1.5 text-gray-500 hover:text-cyan-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Pencil size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => deleteSlotMutation.mutate(slot.id)}
                                                    disabled={deleteSlotMutation.isPending}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    {`Total: ${data.totalItems} slot(s)`}
                    <span className="ml-2">Página {page} de {data.totalPages || 1}</span>
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Anterior
                    </button>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= data.totalPages}
                        className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Siguiente
                    </button>
                </div>
            </div>
        </div >
    );
}
