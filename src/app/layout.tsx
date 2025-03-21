import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientRefineProvider from "./client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP Garment",
  description: "Hệ thống quản lý may mặc",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientRefineProvider>
          {children}
        </ClientRefineProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
