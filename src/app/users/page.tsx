"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query");
    if (query) {
      setSearchQuery(query);
      fetchUsers(query);
    }
  }, [searchParams]);

  const fetchUsers = async (query: string) => {
    try {
      const response = await fetch(
        `/api/users?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      console.log("Dados recebidos:", data);
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(searchQuery);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Buscar Usuários</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar usuários..."
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p className="text-red-500">Senha: {user.password}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Exemplos de SQL Injection:</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <code>1</code> - Retorna todos os usuários (usando OR 1=1)
          </li>
          <li>
            <code>x' OR '1'='1</code> - Retorna todos os usuários (usando OR)
          </li>
          <li>
            <code>x' ORDER BY id DESC --</code> - Ordena resultados
          </li>
          <li>
            <code>
              x' UNION SELECT sql,name,password,email FROM sqlite_master --
            </code>{" "}
            - Vaza estrutura do banco
          </li>
        </ul>
      </div>
    </div>
  );
}
