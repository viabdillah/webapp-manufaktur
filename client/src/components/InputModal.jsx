import { useState } from 'react';

function InputModal({ isOpen, onClose, onSubmit, title, message, inputLabel, submitText }) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue); // Kirim nilai input ke parent
    setInputValue(''); // Reset input
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-gray-600 mb-2">{inputLabel}</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
            autoFocus
          />
          <div className="flex justify-end space-x-4 mt-6">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              {submitText || 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InputModal;