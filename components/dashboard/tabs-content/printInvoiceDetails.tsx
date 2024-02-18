"use client";
import { Button } from "@/components/ui/button";
import jsPDFInvoiceTemplate, { OutputType } from "invoicetemplatejspdf";
import { Invoice, InvoiceItem } from "@/types/types";
import { UserProfile } from "@/actions/createInvoice";

interface PrintInvoiceDetailsProps {
  invoiceItems: InvoiceItem[] | null;
  invoice: Invoice;
  userProfile: UserProfile;
}

const PrintInvoiceDetails = ({
  invoiceItems,
  invoice,
  userProfile,
}: PrintInvoiceDetailsProps) => {
  const subtotal: number = (invoiceItems || []).reduce(
    (acc, item) => acc + (item.amount - item.discount),
    0
  );

  const handlePrint = () => {
    const props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: true,
      fileName: `Invoice_${invoice.customer_name}_${new Date(
        invoice.created_at
      ).toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/logo.png",
        type: "PNG",
        width: 53.33, //aspect ratio = width/height
        height: 26.66,
        margin: {
          top: 0,
          left: 0,
        },
      },
      stamp: {
        inAllPages: false, //by default = false, just in the last page
        src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
        type: "JPG",
        width: 20, //aspect ratio = width/height
        height: 20,
        margin: {
          top: 0,
          left: 0,
        },
      },
      business: {
        name: `${userProfile.company_name}`,
        address: `${userProfile.company_address}`,
        phone: `${userProfile.company_name}`,
        email: "email@example.com",
        email_1: "info@example.al",
        website: "www.example.al",
      },
      contact: {
        label: "Invoice issued for:",
        name: `${invoice.customer_name}`,
        address: `${invoice.customer_address ?? ""}`,
        phone: `${invoice.customer_phone_number ?? ""}`,
        email: "client@website.al",
        otherInfo: "www.website.al",
      },
      invoice: {
        label: `Invoice #:`,
        num: invoice.invoice_number,
        invGenDate: `Invoice Date: ${new Date(
          invoice.created_at
        ).toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`,
        headerBorder: true,
        tableBodyBorder: true,
        header: [
          {
            title: "#",
          },
          {
            title: "Product",
            style: {
              width: 70,
            },
          },
          {
            title: "Size",
            style: {
              width: 23,
            },
          },
          { title: "Quantity" },
          { title: "Amount" },
          { title: "Disc" },
          { title: "Total" },
        ],
        table: invoiceItems?.map((item, index) => [
          index + 1,
          item.product,
          item.size,
          item.quantity,
          item.amount,
          item.discount,
          item.amount - item.discount,
        ]),
        additionalRows: [
          {
            col1: "Total:",
            col2: String(invoice.total_amount),
            col3: "PkR",
            style: {
              fontSize: 14,
            },
          },
          {
            col1: "Disc:",
            col2: String(invoice.total_discount.toFixed(2)),
            style: {
              fontSize: 10,
            },
          },
          {
            col1: "SubTotal:",
            col2: String(subtotal.toFixed(2)),
            col3: "PKR",
            style: {
              fontSize: 10,
            },
          },
        ],
        invDescLabel: "Invoice Note",
        invDesc:
          "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary.",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };
    console.log("PDF Properties", props);

    const pdf = jsPDFInvoiceTemplate(props);
  };

  return (
    <Button onClick={handlePrint} className="py">
      Print Invoice
    </Button>
  );
};

export default PrintInvoiceDetails;
