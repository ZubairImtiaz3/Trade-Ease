"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { onBoardSubmit } from "@/actions/settingsSubmit";

interface ProfileFormData {
  first_name: string;
  last_name: string;
  company_name: string;
  company_address: string;
  company_phone: number;
}

const schema = yup
  .object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required(" Second name is required"),
    company_name: yup.string().required("Name is required"),
    company_address: yup.string().required("Address is required"),
    company_phone: yup.number().required("Phone number is required"),
  })
  .required();

const OnBoarding = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<ProfileFormData> = async (formData) => {
    console.log(formData);
    setLoading(true);

    const error = await onBoardSubmit({ formData });
    if (!error) {
      toast({
        variant: "default",
        title: "Welcome to Trade Ease",
        description: "Your profile has been successfully updated.",
      });
    } else {
      console.log(error);
      toast({
        variant: "default",
        title: "Error",
        description: "An error occurred while updating your profile.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap gap-4 items-baseline">
            <div className="grow">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="Enter your first name"
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name?.message}
                </p>
              )}
            </div>
            <div className="grow">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                type="text"
                id="last_name"
                placeholder="Enter your last phone"
                {...register("last_name")}
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name?.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-baseline">
            <div className="grow">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="Enter your company name"
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">
                  {errors.company_name?.message}
                </p>
              )}
            </div>
            <div className="grow">
              <Label htmlFor="company_phone">Company Phone</Label>
              <Input
                type="number"
                id="company_phone"
                placeholder="Enter your company phone"
                {...register("company_phone")}
              />
              {errors.company_phone && (
                <p className="text-red-500 text-sm">Phone number is required</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="company_address">Company Address</Label>
            <Textarea
              id="company_address"
              placeholder="Company's Address. City, State, Zip, Country"
              {...register("company_address")}
            />
            {errors.company_address && (
              <p className="text-red-500 text-sm">
                {errors.company_address?.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </CardFooter>
      </form>
    </>
  );
};

export default OnBoarding;
