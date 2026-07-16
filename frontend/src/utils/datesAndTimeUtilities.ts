import { format, formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { daysOfWeek } from "../constants";

export const formatDay = (day: string) => {
  return daysOfWeek.find((d) => d.value === day)?.label ?? day;
};

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};

export const formatTime = (timeString: string) => {
  return format(parseISO(timeString), "hh:mm a");
};

export const timeAgo = (dateStr: string) => {
  try {
    return formatDistanceToNow(parseISO(dateStr), {
      addSuffix: true,
      locale: es,
    });
  } catch {
    return dateStr;
  }
};
