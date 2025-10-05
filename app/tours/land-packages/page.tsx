import { redirect } from 'next/navigation';

export default function LandPackagesRedirect() {
  redirect('/packages?type=LAND_ONLY');
}
