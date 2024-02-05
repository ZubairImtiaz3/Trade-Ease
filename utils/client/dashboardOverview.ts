import _ from "lodash";

export const totalInvoices = async (
  supabase: any,
  startDate?: Date,
  endDate?: Date
) => {
  let query = supabase.from("invoices").select("*");

  if (startDate && endDate) {
    query = query
      .gte("created_at", startDate.toISOString())
      .lt("created_at", endDate.toISOString());
  }

  const { data: invoices, error } = await query;

  return { invoices, error };
};

export const totalRevenue = async (invoices: []) => {
  let revenue = _.sumBy(invoices, "total_amount");
  return revenue;
};

export const totalSalesNumber = async (invoices: []) => {
  let SalesNumber = invoices?.length;
  return SalesNumber;
};

export const topCustomer = async (invoices: []) => {
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

export const recentSales = async (invoices: []) => {
  let recentSalesData = _.takeRight(invoices, 5);
  return recentSalesData;
};

export const topProduct = async (supabase: any, invoices: []) => {
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

  return { topProduct, totalQuantity };
};

export const InvoiceNumber = async (supabase: any) => {
  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("invoice_number", { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    // Extract the last invoice number from the result
    const lastInvoiceNumber =
      invoices && invoices.length > 0 ? invoices[0].invoice_number : null;

    return { lastInvoiceNumber, error: null };
  } catch (error) {
    return { lastInvoiceNumber: null, error };
  }
};