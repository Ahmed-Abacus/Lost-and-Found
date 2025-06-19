import './styles/globals.css';


export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className="font-sans bg-gray-100 text-gray-900">
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-center text-xl font-bold">Lost and Found</h1>
          </header>
          <main className="p-6">{children}</main>
        </body>
      </html>
    );
  }