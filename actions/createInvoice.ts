"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export interface InvoiceItem {
  id: string;
  product: string;
  size: string;
  quantity: number;
  disc: number;
  amount: number;
}

export interface InvoiceSummary {
  data: InvoiceItem[];
  totals: {
    totalDisc: number;
    totalAmount: number;
  };
}

export interface CustomerProfile {
  customerAddress: string | null;
  customerName: string;
  customerPhoneNumber: number | null;
}

export interface UserProfile {
  id: string;
  company_name: string;
  company_address: string;
  company_phone: number;
}

export interface InvoiceData {
  userProfile: UserProfile;
  customerProfile: CustomerProfile;
  invoiceBy: string;
  invoiceSummary: InvoiceSummary;
}

export const createInvoice = async (invoiceData: InvoiceData) => {
  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the authenticated user matches the user in the invoice data
  if (user?.id !== invoiceData.userProfile.id) {
    return { error: "User authentication mismatch." };
  }

  // Insert into invoices table
  const { data: insertedInvoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert([
      {
        invoice_by: invoiceData.invoiceBy,
        customer_name: invoiceData.customerProfile.customerName,
        customer_address: invoiceData.customerProfile.customerAddress,
        customer_phone_number: invoiceData.customerProfile.customerPhoneNumber,
        user_id: user?.id,
        total_amount: invoiceData.invoiceSummary.totals.totalAmount,
        total_discount: invoiceData.invoiceSummary.totals.totalDisc,
      },
    ])
    .select();

  if (invoiceError) {
    return { error: invoiceError };
  }

  // Check if any invoices are inserted and get the id of the first one
  const createdInvoiceId =
    insertedInvoice && insertedInvoice[0] ? insertedInvoice[0].id : null;

  // Insert into invoice_items table
  for (const item of invoiceData.invoiceSummary.data) {
    // Check if the 'product' field is not empty
    if (item.product.trim() !== "") {
      const { error: itemError } = await supabase.from("invoice_items").insert([
        {
          invoice_id: createdInvoiceId,
          product: item.product,
          size: item.size,
          quantity: item.quantity,
          amount: item.amount,
          discount: item.disc,
        },
      ]);

      if (itemError) {
        return { error: itemError };
      }
    }
  }

  revalidatePath("/");

  return { success: true, invoiceId: createdInvoiceId };
};
