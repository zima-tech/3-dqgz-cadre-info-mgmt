import { CompletenessPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function CompletenessRoute() {
  const snapshot = await getCadreSnapshot();
  return <CompletenessPage snapshot={snapshot} />;
}
