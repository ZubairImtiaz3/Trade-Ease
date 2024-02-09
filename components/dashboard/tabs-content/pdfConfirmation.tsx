import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UserProfile } from "@/actions/createInvoice";
import { getInvoiceAndItems } from "@/actions/getInvoiceData";
import { Icons } from "@/components/ui/icons";
import { useState } from "react";

interface PdfConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

export function PdfConfirm({ isOpen, onClose, userProfile }: PdfConfirmProps) {
  const [loading, setLoading] = useState(false);

  const handleYesClick = async () => {
    try {
      setLoading(true);
      const result = await getInvoiceAndItems(userProfile.id);
      console.log("pdfData", result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Do you want to generate Pdf for this Generated Invoice?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-4">
          <Button onClick={onClose}>No</Button>
          <Button type="button" onClick={handleYesClick} disabled={loading}>
            {loading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Yes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
