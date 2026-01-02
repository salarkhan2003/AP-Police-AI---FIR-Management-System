import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AP Police FIR Management System - Digital India Initiative',
  description: 'Advanced FIR Management SaaS Platform for Andhra Pradesh Police Department with AI-powered features, digital signatures, and real-time tracking.',
  keywords: 'AP Police, FIR Management, Digital Police, Crime Management, Police Software',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}

