import React, { useState } from 'react';

interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const AddProductModal: React.FC<{
  onAddProduct: (product: Product) => void;
  onClose: () => void;
}> = ({ onAddProduct, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const numericPrice = parseFloat(price);
    const numericQuantity = Math.max(0, quantity);

    if (!name || !description || !price || isNaN(numericPrice) || numericPrice <= 0 || numericQuantity < 0) {
      setError('Todos os campos são obrigatórios e o preço deve ser um número positivo.');
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name,
        description,
        price: numericPrice,
        quantity: numericQuantity,
      };

      const createResponse = await fetch('http://localhost:3000/product/NewProduct', {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao criar o produto');
      }

      const createData = await createResponse.json();
      const productId = createData.id;

      onAddProduct({ ...productData, id: productId });
      onClose();

    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao processar a operação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto my-8">
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">Adicionar Produto</h2>

          {error && <div className="text-red-600 text-center mb-4 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
              <input
                id="price"
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none text-sm"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
