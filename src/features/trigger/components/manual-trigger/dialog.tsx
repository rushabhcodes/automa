import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: Props) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        This workflow is triggered manually.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4"
                >
                    Used to manually trigger a workflow from the editor or the executions page.
                </div>
            </DialogContent>
        </Dialog>
    );
}