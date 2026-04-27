import { RemindersPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function RemindersRoute() {
  const snapshot = await getCadreSnapshot();
  return <RemindersPage snapshot={snapshot} />;
}
