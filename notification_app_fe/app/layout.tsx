"use client";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Campus Notify
            </Typography>
            <Button color="inherit" component={Link} href="/">
              All Notifications
            </Button>
            <Button color="inherit" component={Link} href="/priority">
              Priority Inbox
            </Button>
          </Toolbar>
        </AppBar>
        <Box>{children}</Box>
      </body>
    </html>
  );
}