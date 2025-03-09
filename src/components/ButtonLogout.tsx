'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ButtonLogout() {
  const router = useRouter()

  async function logout() {
    await signOut({ redirect: false })
    router.replace('/')
  }

  return (
    <button
      onClick={logout}
      className="p-2 px-4 border border-white rounded-md text-orange-500 bg-white hover:bg-orange-600 hover:text-white transition"
    >
      Sair
    </button>
  )
}
