import MedicalRecordAnnexeForm from "../../../../components/dashboard/medical-records/MedicalRecordAnnexeForm";
import GoBackButton from "../../../../components/shared/GoBackButton";

export default function MedicalRecordAnnexeCreatePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Crear Anexo</h1>
                <p className="text-gray-600">
                    Completa el formulario para agregar un nuevo anexo al registro médico
                </p>
            </div>
            <div className="w-fit">
                <GoBackButton to="/dashboard/doctor/patients" />
            </div>
            <MedicalRecordAnnexeForm />
        </div>
    );
}
