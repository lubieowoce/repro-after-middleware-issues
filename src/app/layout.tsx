export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
