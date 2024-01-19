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

import { v4 as uuidv4 } from "uuid";

export type Payment = {
  id: string;
  product: string;
  size: string;
  squareft: string;
  quantity: number;
  disc: number;
  amount: number;
};

export function InvoiceTable() {
  const createNewRow = (): Payment => {
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

  const [data, setData] = useState<Payment[]>([createNewRow()]);

  const handleValueChange = (
    productId: string,
    newValue: string | number,
    property: keyof Payment
  ) => {
    setData((currentData) => {
      let newData = currentData.map((item) => {
        if (item.id === productId) {
          const updatedValue =
            property === "quantity" ||
            property === "disc" ||
            property === "amount"
              ? Number(newValue)
              : newValue;
          return { ...item, [property]: updatedValue };
        }
        return item;
      });

      // Check if the last row was updated and if a product is selected
      if (
        property === "product" &&
        productId === newData[newData.length - 1].id &&
        newValue
      ) {
        newData = [...newData, createNewRow()];
      }

      return newData;
    });
  };

  const columns: ColumnDef<Payment>[] = [
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
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="deployments">Deployments</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.size}
          onValueChange={(newValue) =>
            handleValueChange(row.original.id, newValue, "size")
          }
        >
          <SelectTrigger id={`size-select-${row.id}`}>
            <SelectValue placeholder="Select a size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "squareft",
      header: "Square Ft",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.squareft}
          onValueChange={(newValue) =>
            handleValueChange(row.original.id, newValue, "squareft")
          }
        >
          <SelectTrigger id={`squareft-select-${row.id}`}>
            <SelectValue placeholder="Select square ft" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.quantity.toString()}
          onValueChange={(newValue) =>
            handleValueChange(row.original.id, newValue, "quantity")
          }
        >
          <SelectTrigger id={`quantity-select-${row.id}`}>
            <SelectValue placeholder="Select quantity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "disc",
      header: "Disc",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.disc.toString()}
          onValueChange={(newValue) =>
            handleValueChange(row.original.id, newValue, "disc")
          }
        >
          <SelectTrigger id={`disc-select-${row.id}`}>
            <SelectValue placeholder="Select disc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.amount.toString()}
          onValueChange={(newValue) =>
            handleValueChange(row.original.id, newValue, "amount")
          }
        >
          <SelectTrigger id={`amount-select-${row.id}`}>
            <SelectValue placeholder="Select amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000">1000</SelectItem>
            <SelectItem value="2000">2000</SelectItem>
            <SelectItem value="3000">3000</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    console.log("Updated Data: ", data);
  }, [data]);

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
    </div>
  );
}
