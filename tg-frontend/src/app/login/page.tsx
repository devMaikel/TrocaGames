"use client"; // Marque como Client Component

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { login } from "@/services/userService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor, insira um email válido.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    try {
      setIsLoading(true);
      const data = await login(email, password);
      if (data != "Login successful!") {
        setError("Erro ao fazer login");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* <div className="absolute inset-0 z-0">
        <Image
          src="/images/GamesTrade2.webp"
          alt="Fundo da Gamestrade"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div> */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/GamesTrade2.webp"
          alt="Fundo da Gamestrade"
          fill
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>{" "}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-10">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8 z-10 shadow-lg text-center">
          GamesTrade
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entrar
          </button>
        </form>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">
              Aguarde um instante enquanto conectamos ao servidor...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
