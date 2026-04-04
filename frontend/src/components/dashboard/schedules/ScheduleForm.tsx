import { useForm } from "react-hook-form";
import { Calendar, ChevronDown, Clock } from "lucide-react";
import ErrorMessage from "../../shared/ErrorMessage";
import { useSchedulesMutations } from "../../../hooks/schedules/useSchedules";
import { daysOfWeek } from "../../../constants";
import type { ScheduleFormData } from "../../../types";


export default function ScheduleForm() {

    const { generateScheduleAndSlotsMutation, updateScheduleMutation } = useSchedulesMutations();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ScheduleFormData>({
        defaultValues: {
            day_of_week: "",
            start_time: "",
            end_time: ""
        }
    });

    const onSubmit = (data: ScheduleFormData) => {
        const scheduleData = { ...data, slot_duration: 60 }
        generateScheduleAndSlotsMutation.mutate(scheduleData);
        reset();
    }

    return (
        <div className="max-w-md mx-auto">
            <form className="space-y-5 bg-white p-6 rounded-xl shadow-sm border border-gray-200" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="day_of_week" className="block text-sm font-medium text-gray-700 mb-2">
                        Día de la semana
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            id="day_of_week"
                            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 appearance-none"
                            {...register("day_of_week", {
                                required: "El día de la semana es requerido",
                            })}
                        >
                            <option value="">Selecciona un día</option>
                            {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    {errors.day_of_week && <ErrorMessage message={errors.day_of_week.message} />}
                </div>

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
                    disabled={generateScheduleAndSlotsMutation.isPending}
                    type="submit"
                    className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 ${(generateScheduleAndSlotsMutation.isPending || updateScheduleMutation.isPending || Object.keys(errors).length > 0) ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Guardar Horario
                </button>
            </form>
        </div>
    );
}
