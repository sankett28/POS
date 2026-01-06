import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Retail Boss - AI-Powered Management for Kirana & Cafes',
  description: 'AI-Powered Retail Boss - Smart Management System for Indian Kirana Stores & Cafes',
  keywords: 'retail management, kirana store, cafe management, AI inventory, billing software, India',
  authors: [{ name: 'Helium AI' }],
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

