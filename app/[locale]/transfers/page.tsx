import { Metadata } from 'next';
import TransfersWidgetPage from '@/components/TransfersWidgetPage';

export const metadata: Metadata = {
  title: 'Airport Transfers in Turkey | Book Online | Funny Tourism',
  description: 'Book reliable airport transfers across Turkey. Istanbul, Antalya, Cappadocia & more. Professional drivers, fixed prices, 24/7 service.',
};

export default function TransfersPage() {
  return <TransfersWidgetPage />;
}
