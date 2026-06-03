import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { SimulationProvider } from '@/components/simulation-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans"
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: 'Flux-Stena | Industrial Process Simulation',
  description: 'Advanced simulation platform for electronic waste recycling and secure data destruction processes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark bg-background" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SimulationProvider>{children}</SimulationProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
