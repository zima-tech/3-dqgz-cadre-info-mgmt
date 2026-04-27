import { VerificationPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function VerificationRoute() {
  const snapshot = await getCadreSnapshot();
  return <VerificationPage snapshot={snapshot} />;
}
