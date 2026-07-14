function ConfirmModal({ abierto, titulo, mensaje, onConfirmar, onCancelar }) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 text-red-600 w-10 h-10 rounded-xl flex items-center justify-center text-lg">
            ⚠️
          </div>
          <h3 className="text-lg font-bold text-gray-900">{titulo}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6">{mensaje}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;