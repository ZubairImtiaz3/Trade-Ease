import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const Settings = () => {
  return (
    <>
      <div className="pt-6 p-8">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Company's Information</CardTitle>
            <CardDescription>
              Update and save your company profile for accurate information
              across the board.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-6">
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
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Link href="/">
              <Button variant="ghost">Go to Home</Button>
            </Link>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Settings;
