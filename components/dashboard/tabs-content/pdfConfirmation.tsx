import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onYesClick: () => void;
}

export function PdfConfirm({ isOpen, onClose, onYesClick }: PdfConfirmProps) {
  const handleYesClick = async () => {
    return true;
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
          <Button type="button" onClick={handleYesClick}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
