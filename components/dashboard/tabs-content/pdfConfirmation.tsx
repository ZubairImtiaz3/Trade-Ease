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
    return new Promise((resolve) => {
      onYesClick();
      resolve(true);
    });
  };

  const handleNoClick = () => {
    onClose();
    return Promise.resolve(false);
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
          <Button onClick={handleNoClick}>No</Button>
          <Button type="button" onClick={() => handleYesClick().then(onClose)}>
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
