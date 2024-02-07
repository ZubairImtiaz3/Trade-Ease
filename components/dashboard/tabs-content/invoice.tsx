"use client";
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
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";

import {
  InvoiceData,
  CustomerProfile,
  InvoiceSummary,
} from "@/actions/createInvoice";
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
  let nextInvoiceNumber = lastInvoiceNumber ? lastInvoiceNumber + 1 : null;
  const { toast } = useToast();

  const [saleSummary, setSaleSummary] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceTableKey, setInvoiceTableKey] = useState(0);
  const [isPdfConfirmOpen, setPdfConfirmOpen] = useState(false);
  const [printPdf, setPrintPdf] = useState(false);
  const [isInitialSubmit, setIsInitialSubmit] = useState(false);

  const handlePdfConfirmOpen = () => {
    setPdfConfirmOpen(true);
  };

  const handlePdfConfirmClose = () => {
    setPrintPdf(false);
    setPdfConfirmOpen(false);
  };

  const handleYesPdfClick = async () => {
    console.log("yes");
    setPrintPdf(true);
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
    const pdfResponse = await handlePdfConfirmOpen();

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
      (item) => item.product !== ""
    );

    completeInvoice.invoiceSummary.data = filteredData;

    console.log("completeInvoice", completeInvoice);

    const props = {
      outputType: OutputType.Save,
      fileName: `Invoice_${
        completeInvoice.customerProfile.customerName
      }_${new Date().toISOString().slice(0, 10)}`,
      orientationLandscape: false,
      logo: {
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
        width: 53.33,
        height: 26.66,
      },
      business: {
        name: completeInvoice.userProfile.company_name,
        address: completeInvoice.userProfile.company_address,
        phone: `${completeInvoice.userProfile.company_phone.toString()}`,
        email: "",
        email_1: "",
        website: "",
      },
      contact: {
        label: "Invoice issued for:",
        name: completeInvoice.customerProfile.customerName,
        address: completeInvoice.customerProfile.customerAddress!,
        phone: completeInvoice.customerProfile.customerPhoneNumber?.toString()!,
        email: "",
        otherInfo: "",
      },
      invoice: {
        label: "Invoice #: ",
        invTotalLabel: "Total:",
        num: nextInvoiceNumber,
        invDate: `Payment Date: ${new Date().toLocaleString()}`,
        invGenDate: `Invoice Date: ${new Date().toLocaleString()}`,
        header: ["#", "Description", "Price", "Quantity", "Unit", "Total"],
        headerBorder: true,
        tableBodyBorder: true,
        table: completeInvoice.invoiceSummary.data.map((item, index) => ({
          num: index + 1,
          desc: item.product,
          price: item.amount,
          quantity: item.quantity,
          unit: item.size,
          total: `${item.amount}/-`,
        })),
        invTotal: `${completeInvoice.invoiceSummary.totals.totalAmount.toString()}/-`,
        invCurrency: "PKR",
        invDescLabel: "Invoice Note",
        invDesc: "Your invoice note goes here.",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };

    const { error, success } = await createInvoice(completeInvoice);
    console.log("sucess", success);
    if (success) {
      toast({
        variant: "default",
        title: "Sale Generated",
        description: "Invoice has been successfully created.",
      });

      if (printPdf) {
        // If user wants to print, generate PDF
        const pdfObject = jsPDFInvoiceTemplate(props);
        toast({
          variant: "default",
          title: "PDF Generated",
          description: "PDF has been successfully generated.",
        });
        console.log(pdfObject);
        reset();
        setInvoiceTableKey((prevKey) => prevKey + 1);
      }
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
                  disabled={lastInvoiceNumber !== null}
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
        isOpen={isPdfConfirmOpen}
        onClose={handlePdfConfirmClose}
        onYesClick={handleYesPdfClick}
      />
    </>
  );
}