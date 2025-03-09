import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; // Assumindo que você esteja usando next-auth

interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  quantity: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session } = useSession(); // Pega os dados da sessão do usuário

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Verifica se o token está disponível
        const token = session?.user?.accessToken; // Ajuste conforme sua estrutura de sessão

        // Se não houver token, exibe mensagem de erro ou redireciona
        if (!token) {
          console.error('Usuário não autenticado');
          return;
        }

        const response = await fetch('http://localhost:3000/product/AllProducts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Adiciona o token de autenticação
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar produtos');
        }

        const data = await response.json();
        console.log(data); // Verifique o formato da resposta

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          console.log('Nenhum produto encontrado');
          setProducts([]);
        }
      } catch (error) {
        console.error('Erro ao carregar os produtos', error);
        setProducts([]); // Se der erro, define um array vazio
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchProducts();
  }, [session]); // Re-executa se a sessão mudar

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  const filteredProducts = products.filter(product => product.quantity > 0);

  if (filteredProducts.length === 0) {
    return <p>Não há produtos em estoque.</p>;
  }

  return (
    <div className="product-list">
      {filteredProducts.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.imageUrl} alt={product.name} className="product-image" />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">R${product.price}</p>
          <p className="product-quantity">Quantidade: {product.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
