export interface AuthState {
  user: { id: number; name: string; email: string } | null;
  token: string | null;
  isLoggedIn: boolean;
}