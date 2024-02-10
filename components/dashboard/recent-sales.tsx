import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatedCurrency } from "@/utils/client/basicUtlis";

type RecentSalesProps = {
  recentSales: Array<{
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
  }>;
};

function getInitials(name: string): string {
  const words = name.split(" ");
  return words.map((word) => word.charAt(0)).join("");
}

export function RecentSales({ recentSales }: RecentSalesProps) {
  return (
    <div className="space-y-8">
      {recentSales?.length > 0 ? (
        recentSales.map((sale, key) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {getInitials(sale.customer_name)}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {sale.customer_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Invoicer: {sale.invoice_by}
                </p>
              </div>
            </div>
            <div className="sm:ml-auto font-medium mt-2">{`+${formatedCurrency(
              sale.total_amount,
              "PKR"
            )}`}</div>
          </div>
        ))
      ) : (
        <p className="text-lg font-medium leading-none text-center lg:mt-32">
          No recent sales
        </p>
      )}
    </div>
  );
}
