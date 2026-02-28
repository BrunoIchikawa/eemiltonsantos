export const API_URL = 'https://eeprofmsmd.com.br/backend';

export const authService = {
  login: async (password: string): Promise<{ user: string }> => {
    const response = await fetch(`${API_URL}/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Necessário para enviar/receber cookies (sessão)
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error('Senha incorreta ou erro de servidor');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error('Senha incorreta');
    }

    return { user: 'admin' };
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/logout.php`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      console.error(e);
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/check_auth.php`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      return data.auth === true;
    } catch (e) {
      return false;
    }
  }
};
