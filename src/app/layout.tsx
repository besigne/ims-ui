import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from "@mui/material/styles";
import { CookiesProvider } from "next-client-cookies/server";
import ToastProvider from "./toaster";
import "./globals.css";
import { darkTheme } from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IMS",
  description: "Integration Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider theme={darkTheme}>
        <body className={inter.className}>
          <CookiesProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </CookiesProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
