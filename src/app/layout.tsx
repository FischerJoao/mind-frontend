
import NextAuthSessionProvider from '@/providers/sessionProvider'
import './globals.css'
import type { Metadata } from 'next'



export const metadata: Metadata = {
  title: 'ESTOQUE',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <head>
      <link rel="icon" href="/backpack.png" />

      </head>
      <body className="bg-gray-800 text-white">
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}
