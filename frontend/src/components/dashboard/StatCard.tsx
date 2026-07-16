import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function StatCard({ title, value, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
      <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide font-semibold text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
