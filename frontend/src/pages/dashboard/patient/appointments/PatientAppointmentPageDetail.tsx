import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useParams } from "react-router-dom";
import { InfoIcon } from "lucide-react";
import GoBackButton from "../../../../components/shared/GoBackButton";
import PatientAppointmentDetailCard from "../../../../components/dashboard/appointments/PatientAppointmentDetailCard";
import Modal from "../../../../components/shared/Modal";
import { useAppointmentById } from "../../../../hooks/appointments/useAppointmentById";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import { useAppointmentsMutations } from "../../../../hooks/appointments/useAppointmentsMutations";

export default function PatientAppointmentPageDetail() {
  const [cancelModal, setCancelModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const { id } = useParams();
  const { cancelAppointment, confirmAppointment } = useAppointmentsMutations();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: { cancellation_reason: "" },
  });
  const { data, isLoading, error } = useAppointmentById(id as string);

  if (!id) {
    return <Navigate to="/dashboard/patient/my-appointments" />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Navigate to="/dashboard/patient/my-appointments" />;
  }

  const handleCancelModal = () => {
    setCancelModal(true);
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
  };

  const handleCancelEndpoint = (data: { cancellation_reason: string }) => {
    cancelAppointment.mutate({
      id: id as string,
      cancellation_reason: data.cancellation_reason,
    });
    setCancelModal(false);
  };

  const handleConfirmEndpoint = () => {
    confirmAppointment.mutate(id as string);
    setConfirmModal(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Detalle de la Cita
            </h2>
            <p className="text-gray-500 mt-1">
              Información completa de tu cita
            </p>
          </div>

          <GoBackButton to="/dashboard/patient/my-appointments" />
        </div>

        <PatientAppointmentDetailCard
          appointment={data}
          handleCancelModal={handleCancelModal}
          handleConfirmModal={handleConfirmModal}
        />

        <Modal label="Cancelar" isOpen={cancelModal} onClose={() => setCancelModal(false)}>
            <div className="flex flex-col items-center gap-2 mt-5">
              <InfoIcon className="w-12 h-12 text-gray-500" />
              <p className="text-gray-600">
                Al cancelar esta cita, el paciente será notificado. ¿Estás
                seguro?
              </p>
              <form
                className="flex flex-col gap-2 mt-2 w-full"
                onSubmit={handleSubmit(handleCancelEndpoint)}
              >
                <label htmlFor="cancellation_reason" className="text-gray-600">
                  Motivo de cancelación:
                </label>
                <input
                  type="text"
                  id="cancellation_reason"
                  {...register("cancellation_reason", {
                    required: "El motivo de cancelación es obligatorio",
                  })}
                  className="block w-full outline-none pl-4 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 placeholder:text-gray-400"
                />
                {errors.cancellation_reason && (
                  <p className="text-red-500">
                    {errors.cancellation_reason.message}
                  </p>
                )}
                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={() => setCancelModal(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </Modal>

        <Modal label="Confirmar" isOpen={confirmModal} onClose={() => setConfirmModal(false)}>
            <div className="flex flex-col items-center gap-2 mt-5">
              <InfoIcon className="w-12 h-12 text-emerald-600" />
              <p className="text-gray-600 text-center">
                Al confirmar esta cita, el doctor será notificado. ¿Estás
                seguro?
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirmModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmEndpoint}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
              >
                Confirmar Cita
              </button>
            </div>
          </Modal>
      </div>
    );
}
