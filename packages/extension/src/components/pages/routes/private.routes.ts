import { RouteProps } from 'react-router-dom';

import {
  ABOUT_PATH,
  ACCEPT_NFT_OFFER_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  ADD_NEW_WALLET_PATH,
  BURN_NFT_PATH,
  CANCEL_NFT_OFFER_PATH,
  CANCEL_OFFER_PATH,
  CREATE_NFT_OFFER_PATH,
  CREATE_OFFER_PATH,
  DELETE_ACCOUNT_PATH,
  EDIT_WALLET_PATH,
  HISTORY_PATH,
  HOME_PATH,
  LIST_WALLETS_PATH,
  MINT_NFT_PATH,
  NFT_VIEWER_PATH,
  RECEIVE_PATH,
  SEND_PATH,
  SETTINGS_PATH,
  SET_ACCOUNT_PATH,
  SHARE_NFT_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  SIGN_TRANSACTION_PATH,
  SUBMIT_TRANSACTION_PATH,
  TRANSACTION_PATH,
  TRUSTED_APPS_PATH
} from '../../../constants';
import { About } from '../About';
import { AcceptNFTOffer } from '../AcceptNFTOffer';
import { AddNewTrustline } from '../AddNewTrustline';
import { AddNewWallet } from '../AddNewWallet';
import { BurnNFT } from '../BurnNFT';
import { CancelNFTOffer } from '../CancelNFTOffer';
import { CancelOffer } from '../CancelOffer';
import { CreateNFTOffer } from '../CreateNFTOffer';
import { CreateOffer } from '../CreateOffer';
import { DeleteAccount } from '../DeleteAccount';
import { EditWallet } from '../EditWallet';
import { History } from '../History';
import { Home } from '../Home';
import { ListWallets } from '../ListWallets';
import { MintNFT } from '../MintNFT';
import { NFTViewer } from '../NFTViewer';
import { ReceivePayment } from '../ReceivePayment';
import { SendPayment } from '../SendPayment';
import { SetAccount } from '../SetAccount';
import { Settings } from '../Settings';
import { ShareAddress } from '../ShareAddress';
import { ShareNFT } from '../ShareNFT';
import { SharePublicKey } from '../SharePublicKey';
import { SignMessage } from '../SignMessage';
import { SignTransaction } from '../SignTransaction';
import { SubmitTransaction } from '../SubmitTransaction';
import { Transaction } from '../Transaction';
import { TrustedApps } from '../TrustedApps';

type PrivateRouteConfig = RouteProps & {
  element: React.ComponentType;
};

export const privateRoutes: PrivateRouteConfig[] = [
  { path: ABOUT_PATH, element: About },
  { path: ACCEPT_NFT_OFFER_PATH, element: AcceptNFTOffer },
  { path: ADD_NEW_TRUSTLINE_PATH, element: AddNewTrustline },
  { path: ADD_NEW_WALLET_PATH, element: AddNewWallet },
  { path: BURN_NFT_PATH, element: BurnNFT },
  { path: CANCEL_NFT_OFFER_PATH, element: CancelNFTOffer },
  { path: CANCEL_OFFER_PATH, element: CancelOffer },
  { path: CREATE_NFT_OFFER_PATH, element: CreateNFTOffer },
  { path: CREATE_OFFER_PATH, element: CreateOffer },
  { path: DELETE_ACCOUNT_PATH, element: DeleteAccount },
  { path: EDIT_WALLET_PATH, element: EditWallet },
  { path: HISTORY_PATH, element: History },
  { path: HOME_PATH, element: Home },
  { path: LIST_WALLETS_PATH, element: ListWallets },
  { path: MINT_NFT_PATH, element: MintNFT },
  { path: NFT_VIEWER_PATH, element: NFTViewer },
  { path: RECEIVE_PATH, element: ReceivePayment },
  { path: SEND_PATH, element: SendPayment },
  { path: SET_ACCOUNT_PATH, element: SetAccount },
  { path: SETTINGS_PATH, element: Settings },
  { path: SHARE_NFT_PATH, element: ShareNFT },
  { path: SHARE_PUBLIC_ADDRESS_PATH, element: ShareAddress },
  { path: SHARE_PUBLIC_KEY_PATH, element: SharePublicKey },
  { path: SHARE_NFT_PATH, element: ShareNFT },
  { path: SIGN_MESSAGE_PATH, element: SignMessage },
  { path: SIGN_TRANSACTION_PATH, element: SignTransaction },
  { path: SUBMIT_TRANSACTION_PATH, element: SubmitTransaction },
  { path: TRANSACTION_PATH, element: Transaction },
  { path: TRUSTED_APPS_PATH, element: TrustedApps }
];
