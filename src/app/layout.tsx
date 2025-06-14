import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Service',
  description: 'API Service built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
