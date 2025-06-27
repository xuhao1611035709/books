import { Toaster } from "@/components/ui/sonner"
import { Inter } from 'next/font/google'
import Providers from '@/lib/tanstack-query/tanstack-query'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 获取当前语言的消息
  const messages = await getMessages()

  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}