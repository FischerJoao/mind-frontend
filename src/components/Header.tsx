'use client'

import { useSession } from 'next-auth/react'
import ButtonLogout from './ButtonLogout'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex items-center justify-between bg-orange-500 p-4 shadow-md text-white">
      
      <div className="flex items-center gap-2">
        <span className='text-3xl'>📦</span>
        <span className="text-xl font-bold hidden sm:block">ESTOQUE</span>

      </div>

      
      <div className="text-lg">
        Olá, <span className="font-semibold">{session?.user?.name || 'Visitante'}</span>. Bem-vindo(a)!
      </div>

    
      <ButtonLogout />
    </header>
  )
}
