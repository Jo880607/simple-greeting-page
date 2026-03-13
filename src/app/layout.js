import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ReceiptMate | AI 영수증 정리 서비스',
  description: '영수증 찍고, AI가 정리하고, 나는 쉬고. 스마트한 가계부 관리의 혁신',
  keywords: '영수증 정리, AI 가계부, 자동 장부, 세무 관리',
  authors: [{ name: 'ReceiptMate Team' }],
  openGraph: {
    title: 'ReceiptMate | AI 영수증 정리 서비스',
    description: '영수증 찍고, AI가 정리하고, 나는 쉬고',
    url: 'https://receiptmate.co.kr',
    siteName: 'ReceiptMate',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}