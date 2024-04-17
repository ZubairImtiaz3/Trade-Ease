"use client";
import {
  InvoiceData,
  CustomerProfile,
  InvoiceSummary,
} from "@/actions/createInvoice";

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
import React, { useState } from "react";
import { createInvoice } from "@/actions/createInvoice";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/ui/icons";
import { PdfConfirm } from "./pdfConfirmation";

const schema = yup.object().shape({
  invoiceBy: yup.string().required("Invoice by is required"),
  customerName: yup.string().required("Customer Name is required"),
  companyName: yup.string().notRequired(),
  companyPhoneNumber: yup.number().notRequired(),
  companyAddress: yup.string().notRequired(),
  customerPhoneNumber: yup
    .number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    ),
  customerAddress: yup.string().notRequired(),
});

export function Invoice({ userprofile, lastInvoiceNumber }: any) {
  let nextInvoiceNumber =
    lastInvoiceNumber !== null ? lastInvoiceNumber + 1 : 1;
  const { toast } = useToast();

  const [saleSummary, setSaleSummary] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceTableKey, setInvoiceTableKey] = useState(0);
  const [isPdfConfirmOpen, setPdfConfirmOpen] = useState(false);

  const handlePdfConfirmOpen = () => {
    setPdfConfirmOpen(true);
  };

  const handlePdfConfirmClose = () => {
    setPdfConfirmOpen(false);
  };

  const invoiceSalesSummary = (data: any) => {
    setSaleSummary(data);
  };

  //Process Invoice Data
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);

    let customerProfile = {};

    if (userprofile) {
      customerProfile = {
        customerAddress: data.customerAddress || null,
        customerName: data.customerName,
        customerPhoneNumber: data.customerPhoneNumber || null,
      };
    }

    const completeInvoice: InvoiceData = {
      userProfile: userprofile,
      customerProfile: customerProfile as CustomerProfile,
      invoiceBy: data.invoiceBy,
      invoiceSummary: saleSummary as InvoiceSummary,
    };

    // Filter out the items with an empty product field
    const filteredData = completeInvoice.invoiceSummary.data.filter(
      (item) => item.product !== "" && item.size !== ""
    );

    completeInvoice.invoiceSummary.data = filteredData;

    if (filteredData.length === 0) {
      toast({
        variant: "default",
        title: "Attention",
        description: "At least one product is required for the invoice.",
      });
      setLoading(false);
      return;
    }

    console.log("completeInvoice", completeInvoice);

    const { error, success } = await createInvoice(completeInvoice);

    if (success) {
      toast({
        variant: "default",
        title: "Sale Generated",
        description: "Invoice has been successfully created.",
      });
      reset();
      setInvoiceTableKey((prevKey) => prevKey + 1);
      handlePdfConfirmOpen();
    } else {
      console.log(error);
      toast({
        variant: "default",
        title: "Error",
        description: "An error occurred while creating an inovice.",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="flex gap-4 justify-between flex-wrap items-baseline">
              <div className="grow">
                <Label htmlFor="invoice#">Invoice#</Label>
                <Input
                  disabled={nextInvoiceNumber !== null}
                  value={nextInvoiceNumber}
                  type="number"
                  placeholder="Invoice Number"
                />
              </div>
              <div className="grow">
                <Label htmlFor="invoiceBy">Invoice By</Label>
                <Input
                  {...register("invoiceBy")}
                  placeholder="Invoicer's Name"
                />
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
                  {...register("companyName")}
                  disabled={userprofile?.company_name}
                  value={userprofile?.company_name}
                  placeholder="Enter your company name"
                />
              </div>
              <div className="grow">
                <Label htmlFor="companyPhoneNumber">Phone Number</Label>
                <Input
                  {...register("companyPhoneNumber")}
                  type="number"
                  disabled={userprofile?.company_phone}
                  value={userprofile?.company_phone}
                  placeholder="Enter your company phone"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="companyAddress">Address</Label>
              <Textarea
                {...register("companyAddress")}
                disabled={userprofile?.company_address}
                value={userprofile?.company_address}
                placeholder="Company's Address. City, State, Zip, Country"
              />
            </div>
            <CardTitle>Customer's Information</CardTitle>
            <div className="flex gap-4 items-baseline flex-wrap">
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
                <Input
                  {...register("customerPhoneNumber")}
                  type="number"
                  placeholder="Enter you customer's phone"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                {...register("customerAddress")}
                placeholder="Customer's Address. City, State, Zip, Country"
              />
            </div>
            <CardTitle>Sales Summary</CardTitle>
            <InvoiceTable
              key={invoiceTableKey}
              invoiceSalesSummary={invoiceSalesSummary}
            />
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Link href="/">
              <Button variant="ghost">Cancel</Button>
            </Link>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Generate Sale"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <PdfConfirm
        userProfile={userprofile}
        isOpen={isPdfConfirmOpen}
        onClose={handlePdfConfirmClose}
      />
    </>
  );
}
