import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function GoBackButton({ to }: { to: string }) {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(to)} className="flex cursor-pointer items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <ArrowLeft size={20} />
            Volver
        </button>
    )
}
