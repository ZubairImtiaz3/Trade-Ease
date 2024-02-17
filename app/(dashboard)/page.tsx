import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Invoice } from "@/components/dashboard/tabs-content/invoice";
import { ReportTable } from "@/components/dashboard/tabs-content/report-table";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { DashboardData, fetchDashboardData } from "@/services/httpService";
import SelectFilter from "@/components/dashboard/tabs-content/select-filter";
import { getEndDate, getStartDate } from "@/utils/client/dateUtlis";
import { InvoiceNumber, totalInvoices } from "@/utils/client/dashboardOverview";
import { formatedCurrency } from "@/utils/client/basicUtlis";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.from("profiles").select().eq("id", user?.id);

  const userprofile = data && data[0] ? data[0] : null;

  // Get the interval from profile
  const selectedInterval = userprofile?.dashboard_filter_preference;

  // Calculate start and end dates based on user's preference
  const startDate = getStartDate(selectedInterval);
  const endDate = getEndDate(selectedInterval);

  const overallMetrics: DashboardData | Error = await fetchDashboardData(
    supabase,
    startDate,
    endDate
  );

  const { revenue, salesNumber, topCustomer, recentSalesData, topProduct } =
    overallMetrics;

  //Get the reports data
  const { invoices } = await totalInvoices(supabase);

  //Get the last invoice number
  const { lastInvoiceNumber } = await InvoiceNumber(supabase);

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <SelectFilter userprofile={userprofile} />
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invoice">Create Invoice</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatedCurrency(revenue, "PKR")}/-
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {salesNumber !== null ? salesNumber : ""}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Customer
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {topCustomer !== null && topCustomer?.name !== null
                      ? topCustomer.name
                      : "None"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Amount Spent&nbsp;
                    {topCustomer !== null
                      ? formatedCurrency(topCustomer.maxTotalAmount, "PKR")
                      : ""}
                    /-
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Top Selling Product
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {topProduct
                      ? (topProduct.name
                          ? topProduct.name.split("JAPAN").pop()?.trim()
                          : "None") ?? "None"
                      : "None"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Quantity Sold&nbsp;
                    {topProduct ? topProduct.totalQuantity : ""}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="lg:grid gap-4 md:grid-cols-2 lg:grid-cols-7 space-y-4 lg:space-y-0">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Summary Of Recent Generated Invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales recentSales={recentSalesData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="invoice" className="space-y-4">
            <Invoice
              lastInvoiceNumber={lastInvoiceNumber}
              userprofile={userprofile}
            />
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <ReportTable invoices={invoices} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
