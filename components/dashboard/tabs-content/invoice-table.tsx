"use client";
import React, { useEffect, useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { v4 as uuidv4 } from "uuid";

type ProductDetail = {
  size: string;
  squareFt: string;
  amount: string;
};

type ProductDetails = {
  details: ProductDetail[];
};

// Define a map for product details
const productDetailsMap: Record<string, ProductDetails> = {
  "HAJVERY ORTHO PLUS DREAM STAR WAKEFIT JAPAN GHAZI (HARD)": {
    details: [
      { size: "78 X 72 X 8", squareFt: "1", amount: "25900" },
      { size: "78 X 66 X 8", squareFt: "2", amount: "23760" },
      { size: "78 X 60 X 8", squareFt: "3", amount: "21590" },
      { size: "78 X 48 X 8", squareFt: "4", amount: "17280" },
      { size: "78 X 42 X 8", squareFt: "5", amount: "15110" },
      { size: "78 X 39 X 8", squareFt: "6", amount: "14050" },
      { size: "78 X 36 X 8", squareFt: "7", amount: "12950" },
      { size: "72 X 36 X 8", squareFt: "8", amount: "12130" },
      { size: "72 X 30 X 8", squareFt: "9", amount: "10360" },
      { size: "72 X 26 X 8", squareFt: "10", amount: "9400" },
      { size: "70 X 36 X 8", squareFt: "11", amount: "11850" },
      { size: "70 X 30 X 8", squareFt: "12", amount: "10080" },
      { size: "70 X 26 X 8", squareFt: "13", amount: "9140" },
      { size: "78 X 72 X 7", squareFt: "14", amount: "22660" },
      { size: "78 X 66 X 7", squareFt: "15", amount: "20790" },
      { size: "78 X 60 X 7", squareFt: "16", amount: "18890" },
      { size: "78 X 48 X 7", squareFt: "17", amount: "15110" },
      { size: "78 X 42 X 7", squareFt: "18", amount: "13240" },
      { size: "78 X 39 X 7", squareFt: "19", amount: "12290" },
      { size: "78 X 36 X 7", squareFt: "20", amount: "11340" },
      { size: "72 X 36 X 7", squareFt: "21", amount: "10470" },
      { size: "72 X 30 X 7", squareFt: "22", amount: "9040" },
      { size: "72 X 26 X 7", squareFt: "23", amount: "8040" },
      { size: "70 X 36 X 7", squareFt: "24", amount: "10340" },
      { size: "70 X 30 X 7", squareFt: "25", amount: "8900" },
      { size: "70 X 26 X 7", squareFt: "26", amount: "7900" },
      { size: "78 X 76 X 6", squareFt: "27", amount: "19430" },
      { size: "78 X 76 X 6", squareFt: "28", amount: "17830" },
      { size: "78 X 76 X 6", squareFt: "29", amount: "16200" },
      { size: "78 X 76 X 6", squareFt: "30", amount: "12950" },
      { size: "78 X 76 X 6", squareFt: "31", amount: "11340" },
      { size: "78 X 76 X 6", squareFt: "32", amount: "10550" },
      { size: "78 X 76 X 6", squareFt: "33", amount: "9720" },
      { size: "72 X 36 X 6", squareFt: "34", amount: "9200" },
      { size: "72 X 30 X 6", squareFt: "35", amount: "7880" },
      { size: "72 X 26 X 6", squareFt: "37", amount: "7090" },
      { size: "70 X 36 X 6", squareFt: "38", amount: "9080" },
      { size: "70 X 30 X 6", squareFt: "39", amount: "7730" },
      { size: "70 X 26 X 6", squareFt: "40", amount: "6950" },
    ],
  },
  // Add more products as needed
};

// Define the Product type
export type Product = {
  id: string;
  product: string;
  size: string;
  squareft: string;
  quantity: number;
  disc: number;
  amount: number;
};

export function InvoiceTable({ invoiceSalesSummary }: any) {
  const createNewRow = (): Product => {
    return {
      id: uuidv4(),
      product: "",
      size: "",
      squareft: "",
      quantity: 1,
      disc: 0,
      amount: 0,
    };
  };

  const [data, setData] = useState<Product[]>([createNewRow()]);
  const [totals, setTotals] = useState({ totalDisc: 0, totalAmount: 0 });

  const handleValueChange = (
    productId: string,
    newValue: string | number,
    property: keyof Product
  ) => {
    setData((currentData) => {
      let newData = currentData.map((item) => {
        if (item.id === productId) {
          let updatedItem = { ...item, [property]: newValue };

          // Update squareft and amount when size changes
          if (property === "size") {
            const productDetails = productDetailsMap[item.product]?.details;
            const detail = productDetails?.find(
              (detail) => detail.size === newValue
            );
            if (detail) {
              updatedItem.squareft = detail.squareFt;
              updatedItem.amount = Number(detail.amount) * updatedItem.quantity;
            }
          }

          // Recalculate amount when quantity changes
          if (property === "quantity") {
            const productDetails = productDetailsMap[item.product]?.details;
            const detail = productDetails?.find(
              (detail) => detail.size === item.size
            );
            if (detail) {
              updatedItem.amount = Number(detail.amount) * Number(newValue);
            }
          }

          return updatedItem;
        }
        return item;
      });

      // Automatically add a new row if the last row's product is updated
      if (
        property === "product" &&
        productId === newData[newData.length - 1].id &&
        newValue
      ) {
        newData = [...newData, createNewRow()];
      }

      // Calculate Totals
      let totalDisc = 0;
      let totalAmount = 0;

      newData.forEach((item) => {
        totalDisc += Number(item.disc);
        totalAmount += item.amount;
      });

      setTotals({ totalDisc, totalAmount });

      invoiceSalesSummary({
        data: newData,
        totals: { totalDisc, totalAmount },
      });

      return newData;
    });
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.product}
          onValueChange={(newProduct) =>
            handleValueChange(row.original.id, newProduct, "product")
          }
        >
          <SelectTrigger id={`product-select-${row.id}`}>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(productDetailsMap).map((product) => (
              <SelectItem key={product} value={product}>
                {product.charAt(0).toUpperCase() + product.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        const product = row.original.product;
        const sizes = product
          ? productDetailsMap[product]?.details.map((detail) => detail.size) ||
            []
          : [];
        return (
          <Select
            defaultValue={row.original.size}
            onValueChange={(newSize) =>
              handleValueChange(row.original.id, newSize, "size")
            }
          >
            <SelectTrigger id={`size-select-${row.id}`}>
              <SelectValue placeholder="Select a size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "squareft",
      header: "Square Ft",
      cell: ({ row }) => {
        return (
          <Input
            className="max-w-[5rem]"
            readOnly
            type="number"
            value={row.original.squareft}
            onChange={(e) =>
              handleValueChange(row.original.id, e.target.value, "squareft")
            }
          />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <Input
          className="max-w-[5rem]"
          type="number"
          value={row.original.quantity}
          onChange={(e) =>
            handleValueChange(row.original.id, e.target.value, "quantity")
          }
        />
      ),
    },
    {
      accessorKey: "disc",
      header: "Disc",
      cell: ({ row }) => (
        <Input
          className="w-12 md:w-auto md:max-w-[5rem]"
          type="number"
          value={row.original.disc}
          onChange={(e) =>
            handleValueChange(row.original.id, e.target.value, "disc")
          }
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const product = row.original.product;
        const quantity = row.original.quantity;
        const productDetails = productDetailsMap[product]?.details;
        const detail = productDetails?.find(
          (detail) => detail.size === row.original.size
        );
        const amount = detail ? Number(detail.amount) * quantity : 0; // Calculate amount based on quantity

        return (
          <Input
            className="max-w-[10rem]"
            type="number"
            value={amount}
            readOnly
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4 justify-center lg:gap-16 mt-6 lg:justify-end lg:mr-16">
        <div>
          <Label htmlFor="subject">Total Disc</Label>
          <Input
            id="total-disc"
            className="max-w-[5rem]"
            type="number"
            value={totals.totalDisc}
            readOnly
            placeholder="Total Discount Amount"
          />
        </div>
        <div>
          <Label htmlFor="subject">Total Amount</Label>
          <Input
            id="total-amount"
            className="max-w-[10rem]"
            type="number"
            value={totals.totalAmount}
            readOnly
            placeholder="Total Sale Amount"
          />
        </div>
      </div>
    </div>
  );
}
