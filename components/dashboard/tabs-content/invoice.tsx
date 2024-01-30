"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceTable } from "./invoice-table";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  invoiceBy: yup.string().required("Invoice by is required"),
  customerName: yup.string().required("Customer Name is required"),
});

export function Invoice({ userprofile }: any) {
  //Process Invoice Data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <div className="flex gap-4 justify-between items-center flex-wrap">
            <div className="grow">
              <Label htmlFor="invoice#">Invoice#</Label>
              <Input placeholder="Invoice Number" />
            </div>
            <div className="grow">
              <Label htmlFor="invoiceBy">Invoice By</Label>
              <Input {...register("invoiceBy")} placeholder="Invoicer's Name" />
              <p className="text-red-500 text-sm mt-1">
                {errors.invoiceBy?.message}
              </p>
            </div>
            <div className="flex flex-col justify-end gap-1 grow">
              <Label htmlFor="date">Date</Label>
              <DatePicker />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <CardTitle>Company's Information</CardTitle>

          <div className="flex gap-4 items-center flex-wrap">
            <div className="grow">
              <Label htmlFor="companyName">Name</Label>
              <Input
                disabled={userprofile?.company_name}
                value={userprofile?.company_name}
                placeholder="Enter your company name"
              />
            </div>
            <div className="grow">
              <Label htmlFor="companyPhoneNumber">Phone Number</Label>
              <Input
                disabled={userprofile?.company_phone}
                value={userprofile?.company_phone}
                placeholder="Enter your company phone"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              disabled={userprofile?.company_address}
              value={userprofile?.company_address}
              placeholder="Company's Address. City, State, Zip, Country"
            />
          </div>
          <CardTitle>Customer's Information</CardTitle>
          <div className="flex gap-4 items-center flex-wrap">
            <div className="grow">
              <Label htmlFor="customerName">Name</Label>
              <Input
                {...register("customerName")}
                id="subject"
                placeholder="Enter you customer's name"
              />
              <p className="text-red-500 text-sm mt-1">
                {errors.customerName?.message}
              </p>
            </div>
            <div className="grow">
              <Label htmlFor="customerPhoneNumber">Phone Number</Label>
              <Input placeholder="Enter you customer's phone" />
            </div>
          </div>
          <div>
            <Label htmlFor="customerAddress">Address</Label>
            <Textarea placeholder="Customer's Address. City, State, Zip, Country" />
          </div>
          <CardTitle>Sales Summary</CardTitle>
          <InvoiceTable />
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Link href="/">
            <Button variant="ghost">Cancel</Button>
          </Link>

          <Button type="submit">Generate Sale</Button>
        </CardFooter>
      </Card>
    </form>
  );
}