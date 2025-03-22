import '@/app/globals.css';
import { Inter } from "next/font/google";
import { Metadata, Viewport } from 'next';
import { APP_NAME } from '@/config/constants';
import { Providers } from '@/providers';

const inter = Inter({ subsets: ["latin"] });

// Metadata must be exported from a Server Component
export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Hệ thống quản lý sản xuất may mặc",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
