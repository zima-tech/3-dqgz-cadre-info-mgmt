import { requireCurrentUser } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  return (
    <DashboardShell
      title="业务台"
      description="党员、干部信息智能治理系统"
      currentUser={{
        username: user.username,
        name: user.name,
        role: user.role
      }}
    >
      {children}
    </DashboardShell>
  );
}
