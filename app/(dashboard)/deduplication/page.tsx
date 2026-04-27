import { DeduplicationPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function DeduplicationRoute() {
  const snapshot = await getCadreSnapshot();
  return <DeduplicationPage snapshot={snapshot} />;
}
