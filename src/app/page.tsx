import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Demonstração de Vulnerabilidades Web
        </h1>
        <Link
          href="/ataques"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>🛡️</span>
          <span>Ver Demonstração Didática</span>
        </Link>
      </div>

      <div className="space-y-6">
        <section className="border p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">SQL Injection</h2>
          <p className="mb-4">
            Demonstração de vulnerabilidade SQL Injection na busca de usuários.
            Tente usar: <code className="bg-gray-100 p-1">%27 OR 1=1--</code>
          </p>
          <div className="flex space-x-4">
            <Link
              href="/users?query=test"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Testar SQL Injection
            </Link>
          </div>
        </section>

        <section className="border p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Cross-Site Scripting (XSS)
          </h2>
          <p className="mb-4">
            Demonstração de vulnerabilidade XSS nos posts. Tente inserir:{" "}
            <code className="bg-gray-100 p-1">
              &lt;script&gt;alert(\'XSS\');&lt;/script&gt;
            </code>
          </p>
          <div className="flex space-x-4">
            <Link
              href="/posts"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Testar XSS
            </Link>
          </div>
        </section>

        <section className="border p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Exposição de Dados Sensíveis
          </h2>
          <p className="mb-4">
            API retorna senhas em texto puro e informações sensíveis.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/api/users"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ver Dados Sensíveis
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-12 p-4 bg-yellow-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">⚠️ Aviso de Segurança</h3>
        <p>
          Este é um projeto de demonstração que contém vulnerabilidades
          propositais para fins educacionais. NÃO use este código em produção!
        </p>
      </div>
    </main>
  );
}
