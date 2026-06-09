import { getInitials } from "../../utils/getInitials";

export default function UserInitialts({
  name,
  size,
}: {
  name: string;
  size?: "small" | "medium" | "large";
}) {
  const sizeMap = {
    small: {
      width: "w-8 h-8",
      fontSize: "text-sm",
    },
    medium: {
      width: "w-10 h-10",
      fontSize: "text-base",
    },
    large: {
      width: "w-14 h-14",
      fontSize: "text-lg",
    },
  };

  const currentSize = sizeMap[size || "medium"];

  const initials = getInitials(name);

  return (
    <div
      className={`${currentSize.width} rounded-full bg-emerald-100 flex items-center justify-center shrink-0`}
    >
      <span
        className={`${currentSize.fontSize} text-emerald-700 font-semibold`}
      >
        {initials}
      </span>
    </div>
  );
}
