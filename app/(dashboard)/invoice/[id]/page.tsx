import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const InvoiceDetailsPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  //Get the invoice details
  const { data: invoiceItems } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", params.id);

  console.log(invoiceItems);

  const invoiceId = invoiceItems?.[0]?.invoice_id ?? null;

  console.log(invoiceId);

  //Get Invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select()
    .eq("id", invoiceId);

  console.log(invoice);
  return (
    <div>
      <h1>Invoice Details for ID: {params.id}</h1>
    </div>
  );
};

export default InvoiceDetailsPage;
