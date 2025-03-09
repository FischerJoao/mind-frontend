import React, { useState, useEffect } from 'react';

interface Product {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

const AddProductModal: React.FC<{
  onAddProduct: (product: Product) => void;
  onClose: () => void;
  product?: Product;
}> = ({ onAddProduct, onClose, product }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setImageUrl(product.imageUrl);
      setPrice(String(product.price));
      setQuantity(product.quantity);
    }
  }, [product]);

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
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      setError('Você precisa estar autenticado.');
      setIsSubmitting(false);
      return;
    }
  
    // Criar objeto de dados SEM o ID
    const productData = {
      name,
      description,
      imageUrl,
      price: numericPrice,
      quantity: numericQuantity
    };
  
    try {
      let response;
      
      if (product?.id) {
        // Atualizar produto existente
        response = await fetch(`http://localhost:3000/product/updateProduct/${product.id}`, {
          method: 'PATCH',
          body: JSON.stringify(productData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      } else {
        // Adicionar novo produto
        response = await fetch('http://localhost:3000/product/NewProduct', {
          method: 'POST',
          body: JSON.stringify(productData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ? 
            (Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message) : 
            'Erro ao processar a requisição'
        );
      }
      
      // Tenta obter os dados da resposta (pode não retornar JSON válido em alguns casos)
      let responseData = {};
      try {
        responseData = await response.json();
      } catch (error) {
        console.log('Resposta não contém JSON válido, continuando com sucesso');
      }
      
      // Para interface - mantém o ID original se for edição ou usa o retornado pela API se for criação
      const finalProduct = product?.id ? 
        { ...productData, id: product.id } : 
        { ...productData, id: responseData.id || undefined };
      
      // Atualiza a interface com o produto finalizado
      onAddProduct(finalProduct);
      
      // Fecha o modal após sucesso
      onClose();
      
    } catch (error) {
      console.error('Erro ao processar produto:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao processar a operação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">
          {product ? 'Editar Produto' : 'Adicionar Produto'}
        </h2>

        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Imagem URL</label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : (product ? 'Salvar Alterações' : 'Adicionar Produto')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isSubmitting}
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;