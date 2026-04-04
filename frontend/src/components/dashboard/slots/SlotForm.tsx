import { Clock } from "lucide-react";
import { useSlotsMutations } from "../../../hooks/slots/useSlots";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../shared/ErrorMessage";
import type { Slot } from "../../../types";

export default function SlotForm() {

    const { updateSlotMutation } = useSlotsMutations();
    const { register, handleSubmit, formState: { errors } } = useForm<Slot>();
    const { id } = useParams();

    const onSubmit = (data: Slot) => {
        updateSlotMutation.mutate({ id: id as string, slotData: data });
    }

    return (
        <div className="max-w-md mx-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                            Hora de inicio
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="start_time"
                                type="time"
                                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                {...register("start_time", {
                                    required: "La hora de inicio es requerida",
                                })}
                            />
                        </div>
                        {errors.start_time && <ErrorMessage message={errors.start_time.message} />}
                    </div>

                    <div>
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                            Hora de fin
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="end_time"
                                type="time"
                                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                                {...register("end_time", {
                                    required: "La hora de fin es requerida",
                                })}
                            />
                        </div>
                        {errors.end_time && <ErrorMessage message={errors.end_time.message} />}
                    </div>
                </div>

                <button
                    type="submit"
                    className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200`}
                >
                    Guardar Horario
                </button>
            </form>
        </div>
    )
}