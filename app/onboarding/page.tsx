import OnBoarding from "@/components/dashboard/onBoarding";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { checkOnBoard } from "@/utils/supabase/session";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const onBoardStatus = await checkOnBoard();
  if (onBoardStatus !== true) {
    redirect("/");
  }
  return (
    <>
      <div className="flex flex-col justify-center h-[100vh] pt-6 p-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome Aboard!</h2>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Let's Get Started!</CardTitle>
            <CardDescription>
              Provide your personal and company details below to ensure accurate
              information throughout the system. Remember, you can edit these
              details in the settings later for any updates
            </CardDescription>
          </CardHeader>
          <OnBoarding />
        </Card>
      </div>
    </>
  );
};

export default page;
