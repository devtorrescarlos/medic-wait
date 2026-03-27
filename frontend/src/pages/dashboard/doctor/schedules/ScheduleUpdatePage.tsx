import GoBackButton from "../../../../components/shared/GoBackButton";
import ScheduleUpdateForm from "../../../../components/dashboard/schedules/ScheduleUpdateForm";


export default function ScheduleUpdatePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Actualizar Horario</h1>
                <p className="text-gray-600">Completa el formulario para actualizar el horario</p>
            </div>
            <div className="w-fit">
                <GoBackButton to="/dashboard/doctor/schedule" />
            </div>
            <ScheduleUpdateForm />
        </div>
    )
}
