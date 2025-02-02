const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const token = localStorage.getItem("access_token");

export async function login(email: string, password: string): Promise<string> {
  try {
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginResponse.json();

    if (!loginResponse.ok) {
      throw new Error("Erro ao fazer login");
    }

    localStorage.setItem("access_token", loginData.access_token);

    const userResponse = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${loginData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      throw new Error("Erro ao buscar dados do usuário");
    }

    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);

    return "Login successful!";
  } catch (error) {
    console.error("Erro durante o login:", error);
    throw error;
  }
}

export const validateToken = async (): Promise<boolean> => {
  try {
    const userResponse = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.log("token inválido");
      return false;
    }

    localStorage.setItem("user_id", userData.id);
    localStorage.setItem("user_name", userData.name);
    return true;
  } catch (error) {
    console.error("Erro ao renovar o token:", error);
    return false;
  }
};

export const getUserDataByToken = async (): Promise<Response> => {
  try {
    const userResponse = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return userResponse;
  } catch (err) {
    console.log(err);
    throw new Error("Erro ao pegar dados de usuário.");
  }
};

export const patchUserDataByToken = async (
  name: string,
  email: string,
  bio: string
): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}/user`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      bio,
    }),
  });
  return response;
};

export const uploadProfileImage = async (
  formData: FormData
): Promise<Response> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/image/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response;
  } catch (err) {
    console.log(err);
    throw new Error("Erro no upload de foto.");
  }
};
