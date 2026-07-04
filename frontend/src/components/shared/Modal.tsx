import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

type ModalProps = {
    label: string;
    isOpen: boolean;
    onClose?: () => void;
    children: React.ReactNode;
}

export default function Modal({ label, isOpen, onClose, children }: ModalProps) {
    return (
        <Dialog open={isOpen} onClose={onClose ?? (() => {})} className="relative z-50">
            <DialogBackdrop className="fixed inset-0 bg-black/50" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                    <DialogTitle className="text-lg font-semibold text-gray-800 text-center uppercase">
                        {label}
                    </DialogTitle>
                    {children}
                </DialogPanel>
            </div>
        </Dialog>
    )
}
