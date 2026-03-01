import { AlertTriangle } from 'lucide-react';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CommandConfirm({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-scada-panel border border-scada-border rounded-lg p-6 w-96">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-scada-warning" />
          <h3 className="text-lg font-semibold">Confirm Action</h3>
        </div>
        <p className="text-sm text-gray-300 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-scada-danger hover:bg-red-700 text-white font-medium rounded"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-scada-border hover:bg-gray-600 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
