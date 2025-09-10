"use client";

import Link from "next/link";
import { useState } from "react";

export default function AtaquesPage() {
  const [activeAttack, setActiveAttack] = useState<string | null>(null);

  const attacks = [
    {
      id: "sql-injection",
      title: "SQL Injection",
      icon: "🗃️",
      description:
        "Injeção de código SQL malicioso em consultas de banco de dados",
      severity: "CRÍTICO",
      color: "red",
      details: {
        how: "Atacante insere comandos SQL em campos de entrada para manipular consultas",
        impact:
          "Acesso não autorizado a dados, modificação ou exclusão de informações",
        example: "admin' OR '1'='1' --",
        prevention:
          "Usar prepared statements, validação de entrada e princípio do menor privilégio",
      },
    },
    {
      id: "xss",
      title: "Cross-Site Scripting (XSS)",
      icon: "🌐",
      description: "Execução de scripts maliciosos no navegador do usuário",
      severity: "ALTO",
      color: "orange",
      details: {
        how: "Atacante injeta código JavaScript que é executado no navegador da vítima",
        impact:
          "Roubo de sessões, redirecionamento malicioso, coleta de dados sensíveis",
        example: "<script>alert('XSS Attack!')</script>",
        prevention:
          "Sanitização de entrada, Content Security Policy (CSP), validação de saída",
      },
    },
    {
      id: "data-exposure",
      title: "Exposição de Dados Sensíveis",
      icon: "🔓",
      description: "Exposição inadequada de informações confidenciais",
      severity: "MÉDIO",
      color: "yellow",
      details: {
        how: "Sistema retorna dados sensíveis sem filtros adequados",
        impact:
          "Vazamento de senhas, dados pessoais e informações confidenciais",
        example: "API retorna senhas em texto puro",
        prevention:
          "Criptografia de dados sensíveis, filtros de resposta, princípio do menor privilégio",
      },
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRÍTICO":
        return "bg-red-100 text-red-800 border-red-200";
      case "ALTO":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MÉDIO":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAttackColor = (color: string) => {
    switch (color) {
      case "red":
        return "border-red-200 hover:border-red-300 bg-red-50";
      case "orange":
        return "border-orange-200 hover:border-orange-300 bg-orange-50";
      case "yellow":
        return "border-yellow-200 hover:border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-200 hover:border-gray-300 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🛡️ Laboratório de Segurança Web
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Aprenda sobre as principais vulnerabilidades web através de
            demonstrações interativas e didáticas
          </p>
        </div>

        {/* Attack Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {attacks.map((attack) => (
            <div
              key={attack.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer ${getAttackColor(
                attack.color
              )}`}
              onClick={() =>
                setActiveAttack(activeAttack === attack.id ? null : attack.id)
              }
            >
              {/* Severity Badge */}
              <div
                className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-sm font-bold border ${getSeverityColor(
                  attack.severity
                )}`}
              >
                {attack.severity}
              </div>

              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{attack.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                  {attack.title}
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  {attack.description}
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href={
                      attack.id === "sql-injection"
                        ? "/users?query=test"
                        : attack.id === "xss"
                        ? "/posts"
                        : "/api/users"
                    }
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🚀 Testar Vulnerabilidade
                  </Link>

                  <button
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveAttack(
                        activeAttack === attack.id ? null : attack.id
                      );
                    }}
                  >
                    {activeAttack === attack.id
                      ? "📖 Ocultar Detalhes"
                      : "📖 Ver Detalhes"}
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {activeAttack === attack.id && (
                <div className="px-6 pb-6 border-t border-gray-200 pt-4 animate-fadeIn">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        🔍 Como Funciona:
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {attack.details.how}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        💥 Impacto:
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {attack.details.impact}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        💡 Exemplo:
                      </h4>
                      <code className="bg-gray-100 p-2 rounded text-sm block font-mono">
                        {attack.details.example}
                      </code>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">
                        🛡️ Prevenção:
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {attack.details.prevention}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            🎯 Demonstração Interativa
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                Escolha um Ataque
              </h3>
              <p className="text-gray-600 text-sm">
                Clique em qualquer card acima para ver detalhes
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                Teste a Vulnerabilidade
              </h3>
              <p className="text-gray-600 text-sm">
                Use os botões para navegar e testar
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">
                Aprenda a Prevenir
              </h3>
              <p className="text-gray-600 text-sm">
                Veja as melhores práticas de segurança
              </p>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="text-2xl font-bold text-red-800 mb-3">
                Aviso de Segurança Importante
              </h3>
              <div className="space-y-2 text-red-700">
                <p>
                  • Este é um ambiente de demonstração com vulnerabilidades
                  propositais
                </p>
                <p>• NUNCA use este código em aplicações de produção</p>
                <p>
                  • As vulnerabilidades são intencionais para fins educacionais
                </p>
                <p>• Sempre implemente as medidas de prevenção mostradas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
          >
            <span>←</span>
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
