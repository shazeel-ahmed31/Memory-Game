import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Game',
  description: 'An accessible eight-pair memory game built with React and TypeScript.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
