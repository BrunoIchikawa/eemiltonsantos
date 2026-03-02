import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

interface ConfirmContextType {
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm deve ser usado dentro de ConfirmProvider');
  return ctx.showConfirm;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    open: boolean;
    options: ConfirmOptions;
    resolve: ((value: boolean) => void) | null;
  }>({
    open: false,
    options: { message: '' },
    resolve: null,
  });

  const showConfirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ open: true, options, resolve });
    });
  }, []);

  const handleClose = (result: boolean) => {
    state.resolve?.(result);
    setState({ open: false, options: { message: '' }, resolve: null });
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}

      {state.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => handleClose(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className={`flex items-center gap-3 p-5 border-b ${
              state.options.variant === 'danger' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'
            }`}>
              <div className={`p-2 rounded-full ${
                state.options.variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  state.options.variant === 'danger' ? 'text-red-600' : 'text-amber-600'
                }`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {state.options.title || 'Confirmação'}
              </h3>
              <button
                onClick={() => handleClose(false)}
                className="ml-auto p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-gray-600 leading-relaxed">{state.options.message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => handleClose(false)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {state.options.cancelText || 'Cancelar'}
              </button>
              <button
                onClick={() => handleClose(true)}
                className={`px-5 py-2.5 text-sm font-bold text-white rounded-lg transition-colors ${
                  state.options.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                {state.options.confirmText || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
