type AppointmentCardItemsProps = {
  initials?: React.JSX.Element;
  icon?: React.JSX.Element;
  iconBgColor: string;
  title: string;
  description: string;
};

export default function AppointmentCardItems({
  initials,
  icon,
  title,
  description,
  iconBgColor,
}: AppointmentCardItemsProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      {initials ? (
        initials
      ) : (
        <div
          className={
            iconBgColor +
            " w-14 h-14 rounded-full flex items-center justify-center shrink-0"
          }
        >
          {icon}
        </div>
      )}
      <div>
        <div className="flex items-center gap-2 text-gray-500 mb-1">
          <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
            {title}
          </span>
        </div>
        <p className="font-medium text-gray-700">{description}</p>
      </div>
    </div>
  );
}
