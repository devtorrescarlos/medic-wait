import { useState } from "react";
import SlotsTable from "../../../../components/dashboard/slots/SlotsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useSlots } from "../../../../hooks/useSlots";




export default function SlotsPage() {
    const [page, setPage] = useState(1);
    const [dayFilter, setDayFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const limit = 10;

    const { data, isLoading, error } = useSlots(page, limit, dayFilter || undefined, dateFilter || undefined);

    if (isLoading) return <LoadingSpinner />

    if (error) return <p>Error al cargar los slots</p>

    const hasNoResults = data.slots.length === 0 && data.totalItems === 0;

    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Slots</h2>
                <p className="text-gray-500 mt-1">Administra tus bloques de disponibilidad</p>
            </div>

            <SlotsTable
                data={data}
                setPage={setPage}
                page={page}
                dayFilter={dayFilter}
                setDayFilter={setDayFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                hasNoResults={hasNoResults}
            />
        </div>
    )
}
