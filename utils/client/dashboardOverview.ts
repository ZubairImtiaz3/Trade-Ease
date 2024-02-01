import { startOfDay, endOfDay } from "date-fns";
import _ from "lodash";

export const totalTodayInvoices = async (supabase: any) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .gte("created_at", todayStart.toISOString())
    .lt("created_at", todayEnd.toISOString());

  return { invoices, error };
};

export const totalTodayRevenue = async (supabase: any) => {
  const { invoices, error } = await totalTodayInvoices(supabase);
  let todaySale = _.sumBy(invoices, "total_amount");

  return { todaySale, error };
};

export const totalTodaySales = async (supabase: any) => {
  const { invoices, error } = await totalTodayInvoices(supabase);
  let todaySalesNumber = invoices?.length;

  return { todaySalesNumber, error };
};

export const todayTopCustomer = async (supabase: any) => {
  const { invoices, error } = await totalTodayInvoices(supabase);

  // Group invoices by customer_name
  const groupedInvoices = _.groupBy(invoices, "customer_name");

  // Calculate the total amount for each customer
  const customerTotals = _.mapValues(groupedInvoices, (customerInvoices) =>
    _.sumBy(customerInvoices, "total_amount")
  );

  // Find the customer with the highest total amount
  const topCustomer = _.maxBy(
    Object.keys(customerTotals),
    (customerName) => customerTotals[customerName]
  );

  // Check if topCustomer is undefined (empty invoices array)
  if (topCustomer === undefined) {
    return { topCustomer: null, maxTotalAmount: 0 };
  }

  const maxTotalAmount = customerTotals[topCustomer];

  return { topCustomer, maxTotalAmount };
};

export const recentSales = async (supabase: any) => {
  const { invoices, error } = await totalTodayInvoices(supabase);
  let recentSalesData = _.takeRight(invoices, 5);

  return { recentSalesData, error };
};

export const todayTopProduct = async (supabase: any) => {
  const { invoices, error } = await totalTodayInvoices(supabase);

  if (error) {
    return { topProduct: null, totalQuantity: null, error };
  }

  let topProduct = null;
  let totalQuantity = 0;

  const allProductIds = _.flatMap(invoices, "id");

  if (allProductIds.length > 0) {
    const { data: invoiceItems, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .in("invoice_id", allProductIds);

    if (itemsError) {
      return { topProduct: null, totalQuantity: null, error: itemsError };
    }

    // Group invoice items by product and sum their quantities
    const groupedByProduct = _.groupBy(invoiceItems, "product");
    const productQuantities = _.mapValues(groupedByProduct, (items) =>
      _.sumBy(items, "quantity")
    );

    // Find the product with the maximum quantity sold
    topProduct = _.maxBy(
      _.keys(productQuantities),
      (product) => productQuantities[product]
    );

    if (topProduct !== null && topProduct !== undefined) {
      totalQuantity = productQuantities[topProduct];
    }
  }

  return { topProduct, totalQuantity, error: null };
};
