import { useMemo } from "react";
import { Filter, Trash2, Pencil } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Slot, SlotsData } from "../../../types";
import { Link } from "react-router-dom";
import { useSlotsMutations } from "../../../hooks/slots/useSlots";
import { formatDay } from "../../../utils/formatDay";
import { useSlotsFilters } from "../../../hooks/slots/useSlotsFilters";


type SlotsTableProps = {
    data: SlotsData,
    page: number
}

export default function SlotsTable({ data, page }: SlotsTableProps) {

    const { deleteSlotMutation } = useSlotsMutations();

    const { statusFilter, dayFilter, dateFilter, handleDayFilterChange, handleDateFilterChange, handleCleanFilters, handlePageChange, handleStatusFilterChange } = useSlotsFilters();


    const filteredSlots: Slot[] = useMemo(() => {
        return data.slots.filter(slot => {
            if (statusFilter === "available" && !slot.is_available) return false;
            if (statusFilter === "booked" && slot.is_available) return false;
            if (dateFilter && slot.date !== dateFilter) return false;
            if (dayFilter && formatDay(slot.date) !== dayFilter) return false;
            return true;
        });
    }, [data.slots, statusFilter, dateFilter, dayFilter]);

    const hasNoResults = filteredSlots.length === 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex items-center">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white w-full sm:w-48">
                            <option value="">Todos los estados</option>
                            <option value="available">Disponible</option>
                            <option value="booked">Reservado</option>
                        </select>
                    </div>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => handleDateFilterChange(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />

                    <select
                        value={dayFilter}
                        onChange={(e) => handleDayFilterChange(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white w-full sm:w-48">
                        <option value="">Todos los días</option>
                        <option value="monday">Lunes</option>
                        <option value="tuesday">Martes</option>
                        <option value="wednesday">Miercoles</option>
                        <option value="thursday">Jueves</option>
                        <option value="friday">Viernes</option>
                        <option value="saturday">Sabado</option>
                        <option value="sunday">Domingo</option>
                    </select>

                    <button
                        onClick={handleCleanFilters}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                        Limpiar Filtros
                    </button>
                </div>
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
                                            {slot.start_time ? format(new Date(slot.start_time), 'hh:mm a') : '-'}
                                        </td>


                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {slot.end_time ? format(new Date(slot.end_time), 'hh:mm a') : '-'}
                                        </td>

                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${slot.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {slot.is_available ? 'Disponible' : 'Ocupado'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                            {slot.date ? format(parseISO(slot.date), 'dd/MM/yyyy') + ' - ' + formatDay(slot.schedule.day_of_week) : '-'}
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
                    {`Total: ${data.totalItems} horarios`}
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
