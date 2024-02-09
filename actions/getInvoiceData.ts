"use server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export const getLastInvoice = async (userId: string) => {
  const { data: lastInvoice } = await supabase
    .from("invoices")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  return lastInvoice ? lastInvoice[0] : null;
};

export const getInvoiceItems = async (invoiceId: string) => {
  const { data: invoiceItems } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId);

  return invoiceItems;
};

// Get both the last invoice and its items
export const getInvoiceAndItems = async (userId: string) => {
  const lastInvoice = await getLastInvoice(userId);

  if (!lastInvoice) {
    return null;
  }

  const invoiceItems = await getInvoiceItems(lastInvoice.id);

  return { invoice: lastInvoice, invoiceItems };
};
