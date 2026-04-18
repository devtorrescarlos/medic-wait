
type ModalProps = {
    label: string;
    isOpen: boolean;
    children: React.ReactNode;
}

export default function Modal({ label, isOpen, children }: ModalProps) {
    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg font-semibold text-gray-800 text-center uppercase">{label}</p>
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}
