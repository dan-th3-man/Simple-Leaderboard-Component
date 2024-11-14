import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivyProvider } from '@/components/PrivyProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PrivyProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </PrivyProvider>
      </body>
    </html>
  )
}
