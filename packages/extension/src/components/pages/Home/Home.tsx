import { PageWithNavbar } from '../../templates';
import { Wallet } from '../../molecules/Wallet';
import { useLedger } from '../../../contexts/LedgerContext';

export function Home() {
  const { wallet } = useLedger();

  return (
    <PageWithNavbar>
      <Wallet address={wallet?.address || 'Loading...'} />
    </PageWithNavbar>
  );
}
