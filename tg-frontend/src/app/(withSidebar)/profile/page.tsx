"use client";

import { useState } from "react";
import Image from "next/image";

export default function Profile() {
  const [user, setUser] = useState({
    name: "test",
    email: "test@gmail.com",
    profilePicture: null,
    bio: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log("Dados salvos:", user);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/upload/image/profile", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUser({ ...user, profilePicture: data.url });
          console.log("Upload da foto realizado com sucesso!");
        } else {
          console.error("Erro ao fazer upload da foto");
        }
      } catch (err) {
        console.error("Erro ao conectar com o servidor:", err);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Meu Perfil</h1>

      <div className="flex flex-col items-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Foto de perfil"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-2xl">👤</span>
            </div>
          )}
        </div>

        <label className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
          Selecionar nova foto
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome:
            </label>
            {isEditing ? (
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" // Adicione bg-white e text-gray-900
              />
            ) : (
              <p className="mt-1 text-gray-900">{user.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            {isEditing ? (
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" // Adicione bg-white e text-gray-900
              />
            ) : (
              <p className="mt-1 text-gray-900">{user.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio:
            </label>
            {isEditing ? (
              <textarea
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" // Adicione bg-white e text-gray-900
                rows={3}
              />
            ) : (
              <p className="mt-1 text-gray-900">
                {user.bio || "Nenhuma bio fornecida."}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
