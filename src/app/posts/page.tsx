"use client";

import { useState, useEffect } from "react";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      await fetchPosts();
      setNewPost({ title: "", content: "" });
    } catch (error) {
      console.error("Erro ao criar post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPosts = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/posts", {
        method: "DELETE",
      });
      setPosts([]); // Limpa imediatamente o estado local
      await fetchPosts();
    } catch (error) {
      console.error("Erro ao resetar posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadXSSExample = (example: string) => {
    setNewPost({ title: "Exemplo XSS", content: example });
  };

  const clearForm = () => {
    setNewPost({ title: "", content: "" });
  };

  const emergencyStop = () => {
    setPosts([]); // Para imediatamente a renderização
    window.location.reload(); // Recarrega a página para parar tudo
  };

  const xssExamples = [
    {
      name: "Alert Simples",
      code: `<script>alert('🚨 XSS Detectado!')</script>`,
    },
    {
      name: "Mudança de Cor",
      code: `<script>document.body.style.backgroundColor = 'red'; alert('Página comprometida!')</script>`,
    },
    {
      name: "Imagem Maliciosa",
      code: `<img src="x" onerror="alert('XSS via Imagem')">`,
    },
    {
      name: "Redirecionamento",
      code: `<script>setTimeout(() => window.location.href = 'https://google.com', 2000)</script>`,
    },
    {
      name: "Hover Malicioso",
      code: `<div onmouseover="alert('XSS no hover!')" style="background: yellow; padding: 10px; cursor: pointer;">Passe o mouse aqui</div>`,
    },
    {
      name: "Click Malicioso",
      code: `<button onclick="alert('XSS no click!')" style="background: red; color: white; padding: 10px; border: none; cursor: pointer;">Clique aqui</button>`,
    },
    {
      name: "Texto Simples",
      code: `<p style="color: red; font-weight: bold;">Este é apenas texto HTML simples</p>`,
    },
    {
      name: "Link Malicioso",
      code: `<a href="javascript:alert('XSS via Link!')" style="color: blue; text-decoration: underline;">Clique neste link</a>`,
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Demonstração XSS</h1>
        <div className="flex gap-2">
          <button
            onClick={emergencyStop}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium animate-pulse"
          >
            🚨 PARAR ALERTS
          </button>
          <button
            onClick={resetPosts}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
          >
            {isLoading ? "Carregando..." : "🗑️ Resetar Posts"}
          </button>
        </div>
      </div>

      {/* Aviso sobre a demonstração */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-semibold mb-1">
              Demonstração de Vulnerabilidade XSS
            </h3>
            <p className="text-red-700 text-sm">
              Esta página demonstra uma vulnerabilidade XSS real. Os exemplos
              abaixo contêm código malicioso que será executado no navegador.
              <strong> Use apenas para fins educacionais!</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Exemplos de XSS */}
      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-yellow-800">
          Exemplos de XSS para Testar:
        </h2>
        <p className="text-yellow-700 text-sm mb-3">
          Clique em um exemplo para carregar o código no formulário, depois
          clique em "Criar Post" para ver o XSS em ação.
          <br />
          <strong>🚨 Se os alerts não pararem:</strong> Clique no botão vermelho
          "PARAR ALERTS" no canto superior direito!
        </p>
        <div className="grid grid-cols-4 gap-2">
          {xssExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadXSSExample(example.code)}
              className="text-left p-2 bg-yellow-100 hover:bg-yellow-200 rounded border text-sm"
            >
              {example.name}
            </button>
          ))}
        </div>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Criar Novo Post</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            placeholder="Digite o título do post"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo (⚠️ Vulnerável a XSS)
          </label>
          <textarea
            placeholder="Digite o conteúdo do post (pode conter HTML/JavaScript malicioso)"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
          >
            {isLoading ? "Criando..." : "📝 Criar Post"}
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            🗑️ Limpar
          </button>
        </div>
      </form>

      {/* Lista de Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          Posts Existentes ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum post encontrado. Crie um novo post para testar XSS!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title}
              </h3>
              <div className="text-sm text-gray-600 mb-2">
                Por: {post.author?.name || "Usuário"} •{" "}
                {new Date(post.createdAt).toLocaleString()}
              </div>
              <div className="border-t pt-2">
                <div className="text-sm text-gray-500 mb-1">
                  Conteúdo (renderizado com dangerouslySetInnerHTML):
                </div>
                {/* Vulnerabilidade XSS: Renderizando HTML não sanitizado */}
                <div
                  className="p-2 bg-gray-50 rounded border-l-4 border-red-400"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
