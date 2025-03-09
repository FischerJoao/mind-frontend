import React, { useState, useEffect, useRef } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

const UpdateProductModal: React.FC<{
  onUpdateProduct: (product: Product) => void;
  onClose: () => void;
  product: Product; // O produto agora é obrigatório para edição
}> = ({ onUpdateProduct, onClose, product }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
    setQuantity(product.quantity);
    setImagePreview(product.imageUrl || null); // Se houver imagem no produto, mostra o preview
  }, [product]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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
  
    try {
      const productData = {
        name,
        description,
        price: numericPrice,
        quantity: numericQuantity,
        imageUrl: product.imageUrl || '', // Usar a imagem existente, se não houver novo arquivo
      };
  
      const finalProductData = { ...productData }; // Copiar os dados iniciais
  
      // Se houver um novo arquivo de imagem, enviar para o servidor
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('productData', JSON.stringify(finalProductData)); // Incluir os dados do produto
  
        // Enviar imagem e dados do produto de uma vez
        const response = await fetch(`http://localhost:3000/product/upload/${product.id}`, {
          method: 'PATCH',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao atualizar produto: ${errorData.message || 'Erro desconhecido'}`);
        }
  
        // Atualiza a interface com o produto editado
        const updatedProduct = await response.json();
        onUpdateProduct(updatedProduct); // Atualiza a interface com os dados do produto atualizado
  
      } else {
        // Se não houver nova imagem, apenas atualiza os dados do produto
        const response = await fetch(`http://localhost:3000/product/upload/${product.id}`, {
          method: 'PATCH',
          body: JSON.stringify(finalProductData),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Erro ao atualizar produto: ${errorData.message || 'Erro desconhecido'}`);
        }
  
        // Atualiza a interface com o produto editado
        const updatedProduct = await response.json();
        onUpdateProduct(updatedProduct); // Atualiza a interface com os dados do produto atualizado
      }
  
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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto my-8">
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold text-center mb-4">Editar Produto</h2>

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
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">Imagem do Produto</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  disabled={isSubmitting}
                >
                  {imageFile || imagePreview ? 'Alterar' : 'Selecionar'}
                </button>
                <span className="text-xs text-gray-500 truncate max-w-[200px]">
                  {imageFile ? imageFile.name : imagePreview ? 'Imagem carregada' : 'Nenhuma imagem'}
                </span>
              </div>
              <input
                ref={fileInputRef}
                id="imageFile"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isSubmitting}
              />
              {imagePreview && (
                <div className="mt-1">
                  <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 text-sm text-red-500 hover:text-red-700"
                  >
                    Remover Imagem
                  </button>
                </div>
              )}
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
                {isSubmitting ? 'Enviando...' : 'Atualizar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductModal;
