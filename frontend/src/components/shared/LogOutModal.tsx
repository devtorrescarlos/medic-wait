import Modal from "./Modal";

type LogOutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogOutModal({ isOpen, onClose, onConfirm }: LogOutModalProps) {
  return (
    <Modal label="Cerrar Sesión" isOpen={isOpen} onClose={onClose}>
      <p className="text-sm text-gray-600 text-center mt-3">
        ¿Estás seguro de que deseas cerrar sesión?
      </p>
      <div className="flex gap-3 mt-6">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </Modal>
  );
}
