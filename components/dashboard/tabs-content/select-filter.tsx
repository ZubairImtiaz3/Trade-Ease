"use client";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";

type DateChangeCallback = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => void;

interface SelectFilterProps {
  onDateChange: DateChangeCallback;
}

const SelectFilter: React.FC<SelectFilterProps> = ({ onDateChange }) => {
  const [selectedInterval, setSelectedInterval] = useState("daily");

  const handleIntervalChange = (value: string) => {
    setSelectedInterval(value);
  };

  useEffect(() => {
    const startDate = getStartDate();
    const endDate = getEndDate();
    onDateChange({ startDate, endDate });
  }, [selectedInterval]);

  const getStartDate = (): Date => {
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

  const getEndDate = (): Date => {
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

  return (
    <div className="hidden md:flex items-center space-x-2">
      <div className="grid gap-2">
        <Select
          defaultValue={selectedInterval}
          onValueChange={handleIntervalChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="alltime">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button className="py">Download</Button>
    </div>
  );
};

export default SelectFilter;
