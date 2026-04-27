import { DashboardPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function DashboardRoute() {
  const snapshot = await getCadreSnapshot();
  return <DashboardPage snapshot={snapshot} />;
}
