import { OutputType } from "jspdf-invoice-template";

interface Logo {
  src: string;
  width: number;
  height: number;
}

interface Business {
  name: string;
  address: string;
  phone: string;
  email: string;
  email_1: string;
  website: string;
}

interface Contact {
  label: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  otherInfo: string;
}

interface InvoiceTableItem {
  num: number;
  desc: string;
  price: number;
  quantity: number;
  unit: string;
  total: string;
}

interface Invoice {
  label: string;
  invTotalLabel: string;
  num: number;
  invDate: string;
  invGenDate: string;
  header: string[];
  headerBorder: boolean;
  tableBodyBorder: boolean;
  table: InvoiceTableItem[];
  invTotal: string;
  invCurrency: string;
  invDescLabel: string;
  invDesc: string;
}

interface Footer {
  text: string;
}

export interface Props {
  outputType: any;
  fileName: string;
  orientationLandscape: boolean;
  logo: Logo;
  business: Business;
  contact: Contact;
  invoice: Invoice;
  footer: Footer;
  pageEnable: boolean;
  pageLabel: string;
}

export const getInvoiceProps = (
  completeInvoice: any,
  nextInvoiceNumber: number
): Props => {
  return {
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
      table: completeInvoice.invoiceSummary.data.map(
        (item: any, index: number) => ({
          num: index + 1,
          desc: item.product,
          price: item.amount,
          quantity: item.quantity,
          unit: item.size,
          total: `${item.amount}/-`,
        })
      ),
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
};
