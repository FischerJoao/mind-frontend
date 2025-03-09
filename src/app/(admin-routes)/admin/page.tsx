import Header from "@/components/Header";
import ProductList from "@/components/ProductList"; // Importe o ProductList aqui

export default function Admin() {
  return (
    <div className="w-full h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Adicionando o Header */}
      <Header />

      {/* Conteúdo da Página */}
      <main className="flex-1 p-4">
        <ProductList /> {/* Exibe o componente ProductList na página */}
      </main>
    </div>
  );
}
