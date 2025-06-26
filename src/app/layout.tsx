import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'
import Providers from '@/lib/tanstack-query/tanstack-query'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

export const metadata = {
  title: '图书管理系统',
  description: '基于Next.js的图书管理系统',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}