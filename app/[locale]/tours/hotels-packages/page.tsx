import { redirect } from 'next/navigation';

export default function HotelPackagesRedirect() {
  redirect('/packages?type=WITH_HOTEL');
}
