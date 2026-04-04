import SlotsTable from "../../../../components/dashboard/slots/SlotsTable";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useSlots } from "../../../../hooks/slots/useSlots";
import { useSlotsFilters } from "../../../../hooks/slots/useSlotsFilters";

export default function SlotsPage() {

    const { page, dayFilter, dateFilter, limit } = useSlotsFilters();
    const { data, isLoading, error } = useSlots(page, limit, dayFilter || undefined, dateFilter || undefined);

    if (isLoading) return <LoadingSpinner />

    if (error) return <p>Error al cargar los slots</p>


    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Slots</h2>
                <p className="text-gray-500 mt-1">Administra tus bloques de disponibilidad</p>
            </div>

            <SlotsTable
                data={data}
                page={page}
            />
        </div>
    )
}
