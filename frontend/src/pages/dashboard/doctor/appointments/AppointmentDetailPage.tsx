import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppointmentsMutations } from "../../../../hooks/appointments/useAppointmentsMutations";
import LoadingSpinner from "../../../../components/shared/LoadingSpinner";
import GoBackButton from "../../../../components/shared/GoBackButton";
import AppointmentDetailCard from "../../../../components/dashboard/appointments/AppointmentDetailCard";
import Modal from "../../../../components/shared/Modal";
import { InfoIcon, Plus } from "lucide-react";
import { useAppointmentById } from "../../../../hooks/appointments/useAppointmentById";

export default function AppointmentDetailPage() {
  const [cancelModal, setCancelModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { cancellation_reason: "" } });

  const { id } = useParams();

  if (!id) {
    return <Navigate to="/dashboard/doctor/appointments" />;
  }

  const { completeAppointment, cancelAppointment } = useAppointmentsMutations();
  const { data, isLoading, error } = useAppointmentById(id);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error al cargar la cita</p>;

  const handleCancelModal = () => {
    setCancelModal(true);
  };

  const handleCompleteModal = () => {
    setCompleteModal(true);
  };

  const handleCompleteEndpoint = () => {
    completeAppointment.mutate(id);
    setCompleteModal(false);
  };

  const handleCancelEndpoint = (data: { cancellation_reason: string }) => {
    cancelAppointment.mutate({
      id,
      cancellation_reason: data.cancellation_reason,
    });
    setCancelModal(false);
  };

  if (data)
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Detalle de la Cita
            </h2>
            <p className="text-gray-500 mt-1">
              Información completa de la cita
            </p>
          </div>

          <div className="flex items-center gap-4">
            <GoBackButton to="/dashboard/doctor/appointments" />
            {data.status === "completed" && (
              <Link
                to={`/dashboard/doctor/medical-records/create/${id}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Añadir historia médica
              </Link>
            )}
          </div>
        </div>

        <AppointmentDetailCard
          appointment={data}
          handleCancelModal={handleCancelModal}
          handleCompleteModal={handleCompleteModal}
        />

        {cancelModal && (
          <Modal label="Cancelar" isOpen={cancelModal}>
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
        )}

        {completeModal && (
          <Modal label="Confirmar" isOpen={completeModal}>
            <div className="flex flex-col items-center gap-2 mt-5">
              <InfoIcon className="w-12 h-12 text-gray-500" />
              <p className="text-gray-600">
                Al confirmar esta cita, el paciente será notificado. ¿Estás
                seguro?
              </p>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setCompleteModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCompleteEndpoint}
                className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
}
