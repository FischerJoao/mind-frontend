import Header from "@/components/Header";
import ProductTable from "@/components/ProductTable "; // Importando o ProductTable

export default function Admin() {
  return (
    <div className="w-full h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      
      <Header />

      {/* Conteúdo da Página */}
      <main className="flex-1 p-4 bg-[var(--background)]">
        
        <ProductTable />
      </main>
    </div>
  );
}
