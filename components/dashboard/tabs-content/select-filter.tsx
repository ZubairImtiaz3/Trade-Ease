"use client";
import React, { useEffect, useState } from "react";
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
import { Icons } from "@/components/ui/icons";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update dashboard_filter_preference when selectedInterval changes
  const handleIntervalChange = async (value: string) => {
    setSelectedInterval(value);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden md:flex items-center space-x-2">
      <div className="grid gap-2">
        {isLoading ? (
          <Icons.spinner className="text-[#00E896] mr-1 h-6 w-6 animate-spin" />
        ) : (
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
        )}
      </div>
      <Button disabled={isLoading} className="py">
        Download
      </Button>
    </div>
  );
};

export default SelectFilter;
