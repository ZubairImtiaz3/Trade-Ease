"use client";
import React, { useState, useEffect } from "react";
import settingsSubmit from "@/actions/settingsSubmit";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import isEqual from "lodash/isEqual";

interface FormData {
  company_name: string;
  company_address: string;
  company_phone: number;
}

interface ProfileFormProps {
  data: FormData;
}

const schema = yup
  .object({
    company_name: yup.string().required("Name is required"),
    company_address: yup.string().required("Address is required"),
    company_phone: yup.number().required("Phone number is required"),
  })
  .required();

const ProfileForm = ({ data }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const { toast } = useToast();

  function omitId(obj: Record<string, any>): Record<string, any> {
    if (obj === null || obj === undefined) {
      return {};
    }

    const { id, ...rest } = obj;
    return rest;
  }

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    if (isEqual(omitId(formData), omitId(data))) {
      return toast({
        variant: "default",
        title: "Nothing to update.",
        description: "Please make changes to update.",
      });
    }

    setLoading(true);

    const error = await settingsSubmit({ formData });
    if (!error) {
      toast({
        variant: "default",
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditMode(false);
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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    if (!data) {
      setIsEditMode(true);
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6">
          <div className="flex flex-wrap gap-4 items-baseline">
            <div className="grow">
              <Label htmlFor="company_name">Name</Label>
              <Input
                id="company_name"
                placeholder="Enter your company name"
                defaultValue={data?.company_name || ""}
                disabled={!isEditMode && data?.company_name !== undefined}
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-red-500 text-sm">
                  {errors.company_name?.message}
                </p>
              )}
            </div>
            <div className="grow">
              <Label htmlFor="company_phone">Phone Number</Label>
              <Input
                type="number"
                id="company_phone"
                defaultValue={data?.company_phone || ""}
                disabled={!isEditMode && data?.company_phone !== undefined}
                placeholder="Enter your company phone"
                {...register("company_phone")}
              />
              {errors.company_phone && (
                <p className="text-red-500 text-sm">Phone number is required</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="company_address">Address</Label>
            <Textarea
              id="company_address"
              placeholder="Company's Address. City, State, Zip, Country"
              defaultValue={data?.company_address || ""}
              disabled={!isEditMode && data?.company_address !== undefined}
              {...register("company_address")}
            />
            {errors.company_address && (
              <p className="text-red-500 text-sm">
                {errors.company_address?.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Link href="/">
            <Button variant="ghost">Go to Home</Button>
          </Link>
          {isEditMode ? (
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          ) : (
            <Link href="">
              <Button type="button" onClick={toggleEditMode}>
                Edit
              </Button>
            </Link>
          )}
        </CardFooter>
      </form>
    </>
  );
};

export default ProfileForm;
