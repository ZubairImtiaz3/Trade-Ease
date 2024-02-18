export interface Invoice {
  id: string;
  invoice_by: string;
  customer_name: string;
  customer_address: string | null;
  customer_phone_number: string | null;
  user_id: string;
  created_at: string;
  total_amount: number;
  total_discount: number;
  invoice_number: number;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product: string;
  size: string;
  quantity: number;
  amount: number;
  discount: number;
}
