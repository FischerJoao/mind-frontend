import React from 'react';

interface AddProductButtonProps {
  onClick: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
    >
      Adicionar Produto
    </button>
  );
};

export default AddProductButton;
