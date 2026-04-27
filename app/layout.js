export const metadata = {
  title: "Cirqle",
  description: "Social Media App",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}