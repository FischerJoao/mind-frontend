'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  quantity: number;
}

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return; // Aguardar carregamento completo da sessão

    const fetchProducts = async () => {
      if (!session?.user?.access_token) {
        console.error('Token não encontrado na sessão');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/product/AllProducts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.access_token}`, // Usando access_token
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setProducts(data); // Atualiza os produtos
        } else {
          console.error('Erro ao buscar produtos');
        }
      } catch (error) {
        console.error('Erro na requisição', error);
      } finally {
        setLoading(false); // Remove o carregamento
      }
    };

    fetchProducts(); // Chama a função quando a sessão for carregada
  }, [session, status]); // Rerun the effect if session or status changes

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.id}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">
                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover" />
              </td>
              <td className="border px-4 py-2">{product.price}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
