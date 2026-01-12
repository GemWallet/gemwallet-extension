import {
  ABOUT_PATH,
  ACCEPT_NFT_OFFER_PATH,
  ADD_MPTOKEN_PATH,
  ADD_NEW_TRUSTLINE_PATH,
  ADD_NEW_WALLET_PATH,
  SUBMIT_RAW_TRANSACTION_PATH,
  BURN_NFT_PATH,
  CANCEL_NFT_OFFER_PATH,
  CANCEL_OFFER_PATH,
  CREATE_MPTOKEN_ISSUANCE_PATH,
  CREATE_NFT_OFFER_PATH,
  CREATE_OFFER_PATH,
  DELETE_ACCOUNT_PATH,
  DESTROY_MPTOKEN_ISSUANCE_PATH,
  EDIT_WALLET_PATH,
  HISTORY_PATH,
  HOME_PATH,
  LIST_WALLETS_PATH,
  MINT_NFT_PATH,
  MPTOKEN_REMOVE_PATH,
  NFT_VIEWER_PATH,
  PERMISSIONS_PATH,
  RECEIVE_PATH,
  SEND_PATH,
  SETTINGS_PATH,
  SET_ACCOUNT_PATH,
  SET_HOOK_PATH,
  SET_MPTOKEN_ISSUANCE_PATH,
  SET_REGULAR_KEY_PATH,
  SHARE_NFT_PATH,
  SHARE_PUBLIC_ADDRESS_PATH,
  SHARE_PUBLIC_KEY_PATH,
  SIGN_MESSAGE_PATH,
  SIGN_TRANSACTION_PATH,
  SUBMIT_TRANSACTION_PATH,
  SUBMIT_TRANSACTIONS_BULK_PATH,
  TRANSACTION_PATH,
  TRUSTED_APPS_PATH
} from '../../../constants';
import { About } from '../About';
import { AcceptNFTOffer } from '../AcceptNFTOffer';
import { AddMPToken } from '../AddMPToken';
import { AddNewTrustline } from '../AddNewTrustline';
import { AddNewWallet } from '../AddNewWallet';
import { BurnNFT } from '../BurnNFT';
import { CancelNFTOffer } from '../CancelNFTOffer';
import { CancelOffer } from '../CancelOffer';
import { CreateMPTokenIssuance } from '../CreateMPTokenIssuance';
import { CreateNFTOffer } from '../CreateNFTOffer';
import { MPTokenIssuanceDestroy } from '../MPTokenIssuanceDestroy';
import { MPTokenIssuanceSet } from '../MPTokenIssuanceSet';
import { CreateOffer } from '../CreateOffer';
import { DeleteAccount } from '../DeleteAccount';
import { EditWallet } from '../EditWallet';
import { History } from '../History';
import { Home } from '../Home';
import { ListWallets } from '../ListWallets';
import { MintNFT } from '../MintNFT';
import { MPTokenRemove } from '../MPTokenRemove';
import { NFTViewer } from '../NFTViewer';
import { Permissions } from '../Permissions';
import { ReceivePayment } from '../ReceivePayment';
import { SendPayment } from '../SendPayment';
import { SetAccount } from '../SetAccount';
import { SetHook } from '../SetHook';
import { SetRegularKey } from '../SetRegularKey';
import { Settings } from '../Settings';
import { ShareAddress } from '../ShareAddress';
import { ShareNFT } from '../ShareNFT';
import { SharePublicKey } from '../SharePublicKey';
import { SignMessage } from '../SignMessage';
import { SignTransaction } from '../SignTransaction';
import { SubmitBulkTransactions } from '../SubmitBulkTransactions';
import { SubmitRawTransaction } from '../SubmitRawTransaction';
import { SubmitTransaction } from '../SubmitTransaction';
import { Transaction } from '../Transaction';
import { TrustedApps } from '../TrustedApps';

type PrivateRouteConfig = {
  path: string;
  element: React.FC;
};

export const privateRoutes: PrivateRouteConfig[] = [
  { path: ABOUT_PATH, element: About },
  { path: ACCEPT_NFT_OFFER_PATH, element: AcceptNFTOffer },
  { path: ADD_MPTOKEN_PATH, element: AddMPToken },
  { path: ADD_NEW_TRUSTLINE_PATH, element: AddNewTrustline },
  { path: ADD_NEW_WALLET_PATH, element: AddNewWallet },
  { path: BURN_NFT_PATH, element: BurnNFT },
  { path: CANCEL_NFT_OFFER_PATH, element: CancelNFTOffer },
  { path: CANCEL_OFFER_PATH, element: CancelOffer },
  { path: CREATE_MPTOKEN_ISSUANCE_PATH, element: CreateMPTokenIssuance },
  { path: CREATE_NFT_OFFER_PATH, element: CreateNFTOffer },
  { path: CREATE_OFFER_PATH, element: CreateOffer },
  { path: DELETE_ACCOUNT_PATH, element: DeleteAccount },
  { path: DESTROY_MPTOKEN_ISSUANCE_PATH, element: MPTokenIssuanceDestroy },
  { path: EDIT_WALLET_PATH, element: EditWallet },
  { path: HISTORY_PATH, element: History },
  { path: HOME_PATH, element: Home },
  { path: LIST_WALLETS_PATH, element: ListWallets },
  { path: MINT_NFT_PATH, element: MintNFT },
  { path: MPTOKEN_REMOVE_PATH, element: MPTokenRemove },
  { path: NFT_VIEWER_PATH, element: NFTViewer },
  { path: PERMISSIONS_PATH, element: Permissions },
  { path: RECEIVE_PATH, element: ReceivePayment },
  { path: SEND_PATH, element: SendPayment },
  { path: SET_ACCOUNT_PATH, element: SetAccount },
  { path: SET_HOOK_PATH, element: SetHook },
  { path: SET_MPTOKEN_ISSUANCE_PATH, element: MPTokenIssuanceSet },
  { path: SET_REGULAR_KEY_PATH, element: SetRegularKey },
  { path: SETTINGS_PATH, element: Settings },
  { path: SHARE_NFT_PATH, element: ShareNFT },
  { path: SHARE_PUBLIC_ADDRESS_PATH, element: ShareAddress },
  { path: SHARE_PUBLIC_KEY_PATH, element: SharePublicKey },
  { path: SHARE_NFT_PATH, element: ShareNFT },
  { path: SIGN_MESSAGE_PATH, element: SignMessage },
  { path: SIGN_TRANSACTION_PATH, element: SignTransaction },
  { path: SUBMIT_RAW_TRANSACTION_PATH, element: SubmitRawTransaction },
  { path: SUBMIT_TRANSACTION_PATH, element: SubmitTransaction },
  { path: SUBMIT_TRANSACTIONS_BULK_PATH, element: SubmitBulkTransactions },
  { path: TRANSACTION_PATH, element: Transaction },
  { path: TRUSTED_APPS_PATH, element: TrustedApps }
];
