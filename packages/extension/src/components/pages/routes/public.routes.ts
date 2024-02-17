import {
  CREATE_NEW_WALLET_PATH,
  IMPORT_MNEMONIC_PATH,
  IMPORT_SECRET_NUMBERS_PATH,
  IMPORT_SEED_PATH,
  IMPORT_WALLET_PATH,
  RESET_PASSWORD_PATH,
  WELCOME_PATH
} from '../../../constants';
import { CreateWallet } from '../CreateWallet';
import { ImportMnemonic } from '../ImportMnemonic';
import { ImportSecretNumbers } from '../ImportSecretNumbers';
import { ImportSeed } from '../ImportSeed';
import { ImportWallet } from '../ImportWallet';
import { ResetPassword } from '../ResetPassword';
import { Welcome } from '../Welcome';

type PublicRouteConfig = {
  path: string;
  element: React.FC;
};

export const publicRoutes: PublicRouteConfig[] = [
  { path: CREATE_NEW_WALLET_PATH, element: CreateWallet },
  { path: IMPORT_MNEMONIC_PATH, element: ImportMnemonic },
  { path: IMPORT_SECRET_NUMBERS_PATH, element: ImportSecretNumbers },
  { path: IMPORT_SEED_PATH, element: ImportSeed },
  { path: IMPORT_WALLET_PATH, element: ImportWallet },
  { path: RESET_PASSWORD_PATH, element: ResetPassword },
  { path: WELCOME_PATH, element: Welcome }
];
