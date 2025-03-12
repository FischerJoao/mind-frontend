'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password || password.length < 4 || password.length > 20 || !passwordRegex.test(password)) {
      newErrors.password = 'Senha deve ter entre 4 e 20 caracteres, e conter ao menos uma letra maiúscula, uma minúscula e um número ou caractere especial';
    }

    if (!name || name.length === 0) {
      newErrors.name = 'Nome é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!validateForm()) return;

    const response = await fetch('http://localhost:3000/user/newUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      window.alert('Cadastro realizado com sucesso!');
      router.push('/');
    } else {
      window.alert('Erro no cadastro!')
    }
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
        <h2 style={{ textAlign: 'center', color: '#ff6f00', marginBottom: '20px' }}>Cadastro</h2>

        <label htmlFor="name" style={{ marginBottom: '5px' }}>Nome</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Digite seu nome"
          style={{ 
            padding: '10px', 
            marginBottom: '15px', 
            border: '1px solid #ff6f00', 
            borderRadius: '4px', 
            fontSize: '14px', 
            color: '#333'
          }}
        />
        {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}

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
        {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}

        <label htmlFor="password" style={{ marginBottom: '5px' }}>Senha</label>
        <input
          type="password"
          id="password"
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
        {errors.password && <p style={{ color: 'red', fontSize: '12px' }}>{errors.password}</p>}

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
          Cadastrar
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px' }}>Já tem uma conta? <Link href="/" style={{ color: '#ff6f00' }}>Faça login</Link></p>
        </div>
      </form>
    </div>
  );
}
