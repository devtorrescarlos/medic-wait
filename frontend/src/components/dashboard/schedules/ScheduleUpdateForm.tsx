import { useParams, Navigate } from "react-router-dom";
import ScheduleUpdateFormContent from "./ScheduleUpdateFormContent";

export default function ScheduleUpdateForm() {
    const { id } = useParams();
    if (!id) return <Navigate to="/dashboard/doctor/schedule" replace />;
    return <ScheduleUpdateFormContent id={id} />;
}
