import type { Metadata } from "next";
import { AuthProvider } from "@/app/contexts/AuthContext";
import "./globals.css";
import '@fortawesome/fontawesome-free/css/all.css';
import RootLayout from "@/components/Layout/RootLayout";

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
        <html lang="en">
            <body className="antialiased">
                <AuthProvider>
                    <RootLayout>{children}</RootLayout>
                </AuthProvider>
            </body>
        </html>
    );
}