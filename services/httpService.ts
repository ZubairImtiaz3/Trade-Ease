import {
  recentSales,
  topCustomer,
  topProduct,
  totalRevenue,
  totalSalesNumber,
  totalInvoices,
} from "@/utils/client/dashboardOverview";

type RecentSalesDataType = {
  id: string;
  invoice_number: number;
  invoice_by: string;
  customer_name: string;
  customer_address: string;
  customer_phone_number: number;
  user_id: string;
  created_at: string;
  total_amount: number;
  total_discount: number;
};

export interface DashboardData {
  revenue: number;
  salesNumber: number;
  topCustomer: { name: string | null; maxTotalAmount: number };
  recentSalesData: RecentSalesDataType[];
  topProduct: { name: string | null; totalQuantity: number | null };
}

export const fetchDashboardData = async (
  supabase: any,
  startDate?: Date,
  endDate?: Date
): Promise<DashboardData> => {
  try {
    const { invoices, error: invoicesError } = await totalInvoices(
      supabase,
      startDate,
      endDate
    );

    if (invoicesError) {
      throw invoicesError;
    }

    const [
      revenue,
      salesNumber,
      { topCustomer: topCustomerName, maxTotalAmount },
      recentSalesData,
      { topProduct: topProductName, totalQuantity },
    ] = await Promise.all([
      totalRevenue(invoices),
      totalSalesNumber(invoices),
      topCustomer(invoices),
      recentSales(invoices),
      topProduct(supabase, invoices),
    ]);

    return {
      revenue,
      salesNumber,
      topCustomer: {
        name: topCustomerName,
        maxTotalAmount,
      },
      recentSalesData,
      topProduct: {
        name: topProductName ?? null,
        totalQuantity,
      },
    };
  } catch (error: any) {
    return error;
  }
};
