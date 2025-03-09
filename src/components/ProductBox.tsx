'use client'

import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductBoxProps {
  product: Product;
}

const ProductBox: React.FC<ProductBoxProps> = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-80">
      <h2 className="text-xl font-semibold text-orange-600">{product.name}</h2>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <div className="mt-4">
        <span className="text-gray-800 font-bold">Preço: </span>
        <span className="text-green-600">R$ {product.price.toFixed(2)}</span>
      </div>
      <div className="mt-2">
        <span className="text-gray-800 font-bold">Estoque: </span>
        <span className={product.stock > 0 ? 'text-blue-600' : 'text-red-600'}>
          {product.stock > 0 ? `${product.stock} unidades` : 'Fora de estoque'}
        </span>
      </div>
    </div>
  );
};

export default ProductBox;
