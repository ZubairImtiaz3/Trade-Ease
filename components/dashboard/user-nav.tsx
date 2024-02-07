"use client";
import signOut from "@/actions/signOut";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";


export function UserNav({
  userEmail,
  userName,
}: {
  userEmail: string | undefined;
  userName: string | null;
}) {

  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const response = await signOut();
      if (response?.error === null) {
        toast({
          variant: "default",
          title: "Successfully logged out.",
          description: "Feel free to come back later.",
        });
      } else {
        toast({
          variant: "default",
          title: response?.error,
          description: "An unexpected error occurred during sign-out.",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred during sign-out:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/" alt="Avatar" />
            <AvatarFallback>
              {userName
                ?.split(" ")
                .map((word: any) => word[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/">
            <DropdownMenuItem className="md:hidden">
              Overview
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/customers" className="md:hidden">
            <DropdownMenuItem>
              Customers
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/products" className="md:hidden">
            <DropdownMenuItem>
              Products
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={handleSignOut}>
          <button>
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut className="ml-28">⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}