import React from 'react';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Edit
    </button>
  );
};

export default EditButton;
