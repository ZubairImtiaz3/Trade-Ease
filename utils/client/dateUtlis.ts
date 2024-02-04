import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";

export const getStartDate = (selectedInterval: string): Date => {
  const today = new Date();

  switch (selectedInterval) {
    case "daily":
      return startOfDay(today);
    case "weekly":
      return startOfWeek(today);
    case "monthly":
      return startOfMonth(today);
    default:
      // For "All Time," return the minimum possible date
      return new Date(0);
  }
};

export const getEndDate = (selectedInterval: string): Date => {
  const today = new Date();

  switch (selectedInterval) {
    case "daily":
      return endOfDay(today);
    case "weekly":
      return endOfWeek(today);
    case "monthly":
      return endOfMonth(today);
    default:
      // For "All Time," return the maximum possible date
      return new Date("9999-12-31T23:59:59.999Z");
  }
};
