import type { Metadata } from "next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Poppins } from 'next/font/google';
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.css';
import RootLayout from "@/components/Layout/RootLayout";

const poppins = Poppins({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-poppins',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Rock Paper Scissors Game",
    description: "A fun and interactive rock paper scissors game",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${poppins.variable} font-sans antialiased`}>
                <AuthProvider>
                    <RootLayout>{children}</RootLayout>
                </AuthProvider>
            </body>
        </html>
    );
}