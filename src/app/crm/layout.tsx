// Layout simple del CRM (sin NextAuth SessionProvider).
// La sesión se maneja 100% con cookie simple (nexus-admin-session).
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
