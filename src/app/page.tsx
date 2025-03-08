// pages/index.js
'use client'; // Marca o arquivo como Client Component

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // Função de submissão de formulário (sem lógica real de autenticação)
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Validação simples
    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    // Aqui você pode adicionar a lógica de autenticação real
    console.log('Email:', email);
    console.log('Senha:', senha);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>MIND ESTOQUE</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>

        {erro && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{erro}</div>}

        <label htmlFor="email" style={{ marginBottom: '5px' }}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Digite seu email"
          style={{ padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
        />

        <label htmlFor="senha" style={{ marginBottom: '5px' }}>Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          placeholder="Digite sua senha"
          style={{ padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
        />

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#005bb5'}
          onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#0070f3'}
        >
          Entrar
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          {/* <p style={{ fontSize: '14px' }}>Ainda não tem uma conta? <a href="#" style={{ color: '#0070f3' }}>Cadastre-se</a></p> */}
        </div>
      </form>
    </div>
  );
}
