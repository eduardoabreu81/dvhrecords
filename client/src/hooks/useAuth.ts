import { trpc } from '@/lib/trpc';

/**
 * Hook para autenticação usando Manus OAuth via tRPC
 * 
 * Este projeto usa Manus OAuth integrado, não Firebase.
 * A autenticação é gerenciada automaticamente via cookies de sessão.
 */
export function useAuth() {
  const { data: user, isLoading: loading, error } = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Recarregar página para limpar estado
      window.location.href = '/';
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  return {
    user: user || null,
    loading,
    error: error?.message || null,
    isAuthenticated: !!user,
    logout,
  };
}
