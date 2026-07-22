import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stackTrace: string;
}

export function LogDetailModal({ isOpen, onClose, stackTrace }: LogDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chi tiết Stack Trace</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 rounded-md border mt-2">
          <pre className="text-xs font-mono whitespace-pre-wrap break-words text-slate-800 dark:text-slate-300">
            {stackTrace || "Không có chi tiết stack trace."}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
