import React from 'react';

interface DeleteButtonProps {
  productId: string;
  accessToken: string;
  onDeleteSuccess: (productId: string) => void; // Atualize a assinatura para aceitar o ID do produto
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ productId, accessToken, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/product/deleteProduct/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onDeleteSuccess(productId); // Passa o productId para a função de sucesso
        alert('Produto deletado com sucesso');
      } else {
        alert('Erro ao deletar produto');
      }
    } catch (error) {
      console.error('Erro na exclusão', error);
      alert('Erro ao tentar excluir produto');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
