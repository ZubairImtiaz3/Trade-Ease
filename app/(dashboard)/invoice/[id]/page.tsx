import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { InvoiceDetails } from "@/components/dashboard/tabs-content/invoice-details";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrintInvoiceDetails from "@/components/dashboard/tabs-content/printInvoiceDetails";

const InvoiceDetailsPage = async ({ params }: { params: { id: string } }) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  //Get the invoice details
  const { data: invoiceItems } = await supabase
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", params.id);

  const invoiceId = invoiceItems?.[0]?.invoice_id ?? null;

  //Get Invoice
  const { data: invoice } = await supabase
    .from("invoices")
    .select()
    .eq("id", invoiceId);

  const invoiceData = invoice?.[0] || {};
  const createdAt = invoiceData.created_at || "";

  // Format the date as "MM/DD/YYYY"
  const dateObj = new Date(createdAt);
  const formattedDate = `${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dateObj
    .getDate()
    .toString()
    .padStart(2, "0")}/${dateObj.getFullYear()}`;

  //Get userProfile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("profiles").select().eq("id", user?.id);
  const userprofile = data && data[0] ? data[0] : null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight pb-6 pt-6">
          Invoice Details
        </h2>
        <PrintInvoiceDetails
          invoiceItems={invoiceItems}
          invoice={invoiceData}
          userProfile={userprofile}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 justify-between flex-wrap items-baseline">
            <div className="grow">
              <Label>Invoice#</Label>
              <Input
                value={invoiceData.invoice_number || "Not Available"}
                type="number"
                placeholder="Invoice Number"
                readOnly
              />
            </div>
            <div className="grow">
              <Label>Invoice By</Label>
              <Input
                value={invoiceData.invoice_by || "Not Available"}
                placeholder="Invoicer's Name"
                readOnly
              />
            </div>
            <div className="flex flex-col justify-end gap-1 grow">
              <Label>Date</Label>
              <Input
                value={formattedDate || "Not Available"}
                placeholder="Date"
                readOnly
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <div className="flex gap-4 items-baseline flex-wrap">
            <div className="grow">
              <Label>Name</Label>
              <Input
                id="subject"
                value={invoiceData.customer_name || "Not Available"}
                placeholder="Customer's Name"
                readOnly
              />
            </div>
            <div className="grow">
              <Label>Phone Number</Label>
              <Input
                type="text"
                value={invoiceData.customer_phone_number || "Not Available"}
                placeholder="Customer's Phone"
                readOnly
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea
              value={
                invoiceData.customer_address ||
                "Customer's Address Not Available"
              }
              placeholder="Customer's Address"
              readOnly
            />
          </div>

          <InvoiceDetails invoiceItems={invoiceItems} />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetailsPage;

