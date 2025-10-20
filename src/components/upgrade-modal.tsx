import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
          <AlertDialogDescription>
            You need to upgrade to the Pro plan to access this feature.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => authClient.checkout({ slug: "Automa-Pro" })}
          >
            Upgrade
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
