import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const formatRelativeTime = (date: string | Date | number) => {
  if (!date) return "";
  return dayjs(date).fromNow();
};
