"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceTable } from "./invoice-table";

export function Invoice() {
  return (
    <Card>
      <CardHeader>
        <div className="grid grid-cols-3 gap-4 items-end">
          <div className="grid gap-2">
            <Label htmlFor="subject">Invoice#</Label>
            <Input id="subject" placeholder="" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Invoice By</Label>
            <Input id="subject" placeholder="Invoicer's Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Date</Label>
            <DatePicker />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        <CardTitle>Company's Information</CardTitle>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Name</Label>
            <Input id="subject" placeholder="Enter your company name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Phone Number</Label>
            <Input id="subject" placeholder="Enter your company phone" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Address</Label>
          <Textarea
            id="description"
            placeholder="Company's Address. City, State, Zip, Country"
          />
        </div>
        <CardTitle>Customer's Information</CardTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Name</Label>
            <Input id="subject" placeholder="Enter you customer's name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Phone Number</Label>
            <Input id="subject" placeholder="Enter you customer's phone" />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Address</Label>
          <Textarea
            id="description"
            placeholder="Customer's Address. City, State, Zip, Country"
          />
        </div>
        <CardTitle>Sales Information</CardTitle>
        <InvoiceTable />
        <div className="grid gap-2">
          <Label htmlFor="area">Area</Label>
          <Select defaultValue="billing">
            <SelectTrigger id="area">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="account">Account</SelectItem>
              <SelectItem value="deployments">Deployments</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Generate Sale</Button>
      </CardFooter>
    </Card>
  );
}
