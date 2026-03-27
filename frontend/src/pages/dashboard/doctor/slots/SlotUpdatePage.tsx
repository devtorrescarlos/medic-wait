import GoBackButton from "../../../../components/shared/GoBackButton";
import SlotForm from "../../../../components/dashboard/slots/SlotForm";

export default function SlotUpdatePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Actualizar Slot</h1>
                <p className="text-gray-600">Completa el formulario para actualizar el slot</p>
            </div>
            <div className="w-fit">
                <GoBackButton to="/dashboard/doctor/slots" />
            </div>

            <SlotForm />
        </div>
    )
}
