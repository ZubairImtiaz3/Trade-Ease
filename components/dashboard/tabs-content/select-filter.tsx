"use client";
import React, { useEffect, useState } from "react";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateDashboardFilterPreference } from "@/actions/settingsSubmit";
import { useToast } from "@/components/ui/use-toast";

interface SelectFilterProps {
  userprofile: {
    id: string;
    dashboard_filter_preference?: string;
  };
}

const SelectFilter: React.FC<SelectFilterProps> = ({ userprofile }) => {
  const { toast } = useToast();

  const [selectedInterval, setSelectedInterval] = useState<string>(
    userprofile?.dashboard_filter_preference || ""
  );

  // Update dashboard_filter_preference when selectedInterval changes
  const handleIntervalChange = async (value: string) => {
    setSelectedInterval(value);

    try {
      const error = await updateDashboardFilterPreference({
        updateData: {
          id: userprofile?.id,
          dashboard_filter_preference: value,
        },
      });

      if (error) {
        toast({
          variant: "default",
          title: "Update Failed",
          description: "An Error Occurred. Please try again later.",
        });
      } else {
        toast({
          variant: "default",
          title: "Update Successful",
          description: `Dashboard overview preference switched to ${
            value.charAt(0).toUpperCase() + value.slice(1)
          }`,
        });
      }
    } catch (error) {
      console.error("Error updating dashboard filter preference:", error);
    }
  };

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

  useEffect(() => {
    const startDate = getStartDate();
    const endDate = getEndDate();

    console.log(`Start Date: ${startDate}, End Date: ${endDate}`);
  }, [selectedInterval, userprofile]);

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
