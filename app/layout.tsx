import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "./theme/muiTheme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Twin Explorer | Unlearn",
  description:
    "Interactive digital twin disease progression visualization for Huntington's Disease endpoints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto+Flex:wght@300;400;500;600;700&family=Roboto+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={muiTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
