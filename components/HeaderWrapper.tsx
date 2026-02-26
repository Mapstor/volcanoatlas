import Header from './Header';
import { NavData } from '@/lib/data';

export default function HeaderWrapper({ navData }: { navData: NavData }) {
  return <Header navData={navData} />;
}