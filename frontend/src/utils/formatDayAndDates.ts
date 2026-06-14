import { format, parseISO } from "date-fns";

export const formatDay = (day: string) => {
  return day.at(0)?.toUpperCase() + day.slice(1);
};

export const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};

export const formatTime = (timeString: string) => {
  return format(parseISO(timeString), "hh:mm a");
};
