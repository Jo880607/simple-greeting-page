import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '겨울햇살팀 | 따뜻한 디지털 혁신을 만드는 팀',
  description: '기획, 개발, 마케팅 전문가들이 모인 겨울햇살팀을 소개합니다. 따뜻하면서도 전문적인 디지털 솔루션을 제공합니다.',
  keywords: ['겨울햇살팀', '웹개발', '기획', '마케팅', '디지털솔루션'],
  openGraph: {
    title: '겨울햇살팀 | 따뜻한 디지털 혁신',
    description: '기획, 개발, 마케팅 전문가들이 모인 팀',
    type: 'website',
    locale: 'ko_KR',
    siteName: '겨울햇살팀'
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}