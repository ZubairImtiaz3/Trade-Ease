"use server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { startOfDay, endOfDay } from "date-fns";
import _ from "lodash";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export const totalTodayInvoices = async () => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const { data: invoices, error } = await supabase
    .from("invoices")
    .select("*")
    .gte("created_at", todayStart.toISOString())
    .lt("created_at", todayEnd.toISOString());

  return { invoices, error };
};

export const totalTodayRevenue = async () => {
  const { invoices, error } = await totalTodayInvoices();
  let todaySale = _.sumBy(invoices, "total_amount");

  return { todaySale, error };
};

export const totalTodaySales = async () => {
  const { invoices, error } = await totalTodayInvoices();
  let todaySalesNumber = invoices?.length;

  return { todaySalesNumber, error };
};

export const todayTopCustomer = async () => {
  const { invoices, error } = await totalTodayInvoices();

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
