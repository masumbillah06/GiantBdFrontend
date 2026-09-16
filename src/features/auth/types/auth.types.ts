export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface Session {
  token: string;
  user: LoginResponse['user'];
  expiresAt: string;
}
