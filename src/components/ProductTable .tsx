"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import AddProductButton from "./AddProductButton";
import AddProductModal from "./AddProductModal";
import UpdateProductModal from "./UpdateProductModal";

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
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    if (!session?.user?.access_token) {
      console.error("Token não encontrado na sessão");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/product/AllProducts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.access_token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao buscar produtos");
      }
    } catch (error) {
      console.error("Erro na requisição", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") {
      fetchProducts();
    }
  }, [session, status]);

  const handleDeleteSuccess = (deletedProductId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== deletedProductId)
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    fetchProducts(); // Recarrega a lista de produtos ao fechar o modal
  };

  const handleAddProduct = async (newProduct: Product) => {
    console.log("Produto Adicionado:", newProduct);
    handleCloseModal();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const updateProductInList = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
    handleCloseModal();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6">
        <AddProductButton
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        />
      </div>

      <div className="w-full overflow-auto bg-[var(--background)]">
        <table className="w-full min-w-[800px] table-auto bg-white shadow-md rounded-lg">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Nome</th>
              <th className="border px-4 py-2">Descrição</th>
              <th className="border px-4 py-2">Imagem</th>
              <th className="border px-4 py-2">Preço unidade</th>
              <th className="border px-4 py-2">Quantidade</th>
              <th className="border px-4 py-2">Adicionar Imagem / Editar / Remover</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.id}</td>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.description}</td>
                <td className="border px-4 py-2">
                  {product.imageUrl ? (
                    <img
                      src={`http://localhost:3000${product.imageUrl}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="border px-4 py-2">{product.price} R$</td>
                <td className="border px-4 py-2">{product.quantity}</td>
                <td className="border px-4 py-2 text-center">
                  <EditButton onClick={() => handleEditProduct(product)} />
                  <DeleteButton
                    productId={product.id}
                    accessToken={session?.user?.access_token}
                    onDeleteSuccess={handleDeleteSuccess}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <>
          {editingProduct ? (
            <UpdateProductModal
              onUpdateProduct={updateProductInList}
              onClose={handleCloseModal}
              product={editingProduct}
            />
          ) : (
            <AddProductModal
              onAddProduct={handleAddProduct}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProductTable;
