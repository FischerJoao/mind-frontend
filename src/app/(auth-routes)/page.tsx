'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const router = useRouter()

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault()

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false
    })

    if (result?.error) {
      console.log(result)
      return
    }

    router.replace('/admin')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#fff6f1' }}>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '350px', 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' 
        }}
      >
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#ff6f00', marginBottom: '20px' }}>MIND ESTOQUE</h1>
        <h2 style={{ textAlign: 'center', color: '#ff6f00', marginBottom: '20px' }}>Login</h2>

        <label htmlFor="email" style={{ marginBottom: '5px' }}>Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Digite seu e-mail"
          style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            border: '1px solid #ff6f00', 
            borderRadius: '4px', 
            fontSize: '14px', 
            color: '#333'
          }}
        />

        <label htmlFor="senha" style={{ marginBottom: '5px' }}>Senha</label>
        <input
          type="password"
          id="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Digite sua senha"
          style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            border: '1px solid #ff6f00', 
            borderRadius: '4px', 
            fontSize: '14px', 
            color: '#333'
          }}
        />

        <button 
          type="submit" 
          style={{ 
            padding: '10px', 
            backgroundColor: '#ff6f00', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '16px', 
            cursor: 'pointer' 
          }}
        >
          Entrar
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px' }}>Ainda não tem uma conta? <a href="/register" style={{ color: '#ff6f00' }}>Cadastre-se</a></p>
        </div>
      </form>
    </div>
  );
}
