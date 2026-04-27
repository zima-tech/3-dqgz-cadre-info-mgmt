import { ProfilesPage } from '@/components/cadre/cadre-pages';
import { getCadreSnapshot } from '@/lib/services';

export default async function ProfilesRoute() {
  const snapshot = await getCadreSnapshot();
  return <ProfilesPage profiles={snapshot.profiles} />;
}
