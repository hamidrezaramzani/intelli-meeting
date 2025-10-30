export type RedirectCallback = () => void;

export interface UseAuthRedirectArgs {
  onRedirect: RedirectCallback;
  type: "logged" | "unlogged";
}
