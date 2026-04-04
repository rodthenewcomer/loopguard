import { redirect } from 'next/navigation';
import { SUPPORT_URL } from '../../lib/constants';

export default function UpgradePage() {
  redirect(SUPPORT_URL);
}