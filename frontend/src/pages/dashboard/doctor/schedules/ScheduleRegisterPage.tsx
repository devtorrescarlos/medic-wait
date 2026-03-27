import ScheduleForm from "../../../../components/dashboard/schedules/ScheduleForm";
import GoBackButton from "../../../../components/shared/GoBackButton";

export default function ScheduleRegisterPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Registrar Horario</h1>
                <p className="text-gray-600">Completa el formulario para registrar un nuevo horario</p>
            </div>
            <div className="w-fit">
                <GoBackButton to="/dashboard/doctor/schedule" />
            </div>
            <ScheduleForm />
        </div>
    )
}
