import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell title="业务台" description="党员、干部信息智能治理系统">{children}</DashboardShell>;
}
