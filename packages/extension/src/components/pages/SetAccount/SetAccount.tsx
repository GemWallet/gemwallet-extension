import { FC, useCallback, useEffect, useState } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Button, Container, Paper, Typography } from '@mui/material';
import { AccountSetAsfFlags } from 'xrpl';

import {
  GEM_WALLET,
  ReceiveSetAccountBackgroundMessage,
  ResponseType,
  SetAccountFlags
} from '@gemwallet/constants';

import { ERROR_RED } from '../../../constants';
import { useLedger, useNetwork } from '../../../contexts';
import { useFees, useTransactionStatus } from '../../../hooks';
import { TransactionStatus } from '../../../types';
import { fromHexMemos, parseSetAccountFlags } from '../../../utils';
import {
  BaseTransactionParams,
  getBaseFromParams,
  initialBaseTransactionParams,
  parseBaseParamsFromURLParams
} from '../../../utils/baseParams';
import { serializeError } from '../../../utils/errors';
import { BaseTransaction } from '../../organisms/BaseTransaction/BaseTransaction';
import { PageWithTitle } from '../../templates';

interface Params extends BaseTransactionParams {
  id: number;
  // SetAccount fields
  flags: SetAccountFlags | null;
  clearFlag: number | null;
  domain: string | null;
  emailHash: string | null;
  messageKey: string | null;
  NFTokenMinter: string | null;
  setFlag: AccountSetAsfFlags | null;
  transferRate: number | null;
  tickSize: number | null;
}

export const SetAccount: FC = () => {
  const [params, setParams] = useState<Params>({
    id: 0,
    // BaseTransaction fields
    ...initialBaseTransactionParams,
    // SetAccount fields
    flags: null,
    clearFlag: null,
    domain: null,
    emailHash: null,
    messageKey: null,
    NFTokenMinter: null,
    setFlag: null,
    transferRate: null,
    tickSize: null
  });
  const [errorRequestRejection, setErrorRequestRejection] = useState<string>('');
  const [isParamsMissing, setIsParamsMissing] = useState(false);
  const [transaction, setTransaction] = useState<TransactionStatus>(TransactionStatus.Waiting);
  const { setAccount } = useLedger();
  const { networkName } = useNetwork();
  const { estimatedFees, errorFees, difference } = useFees(
    {
      TransactionType: 'AccountSet',
      Account: '',
      ...(params.flags ? { Flags: params.flags } : {}),
      ...(params.clearFlag ? { ClearFlag: params.clearFlag } : {}),
      ...(params.domain ? { Domain: params.domain } : {}),
      ...(params.emailHash ? { EmailHash: params.emailHash } : {}),
      ...(params.messageKey ? { MessageKey: params.messageKey } : {}),
      ...(params.NFTokenMinter ? { NFTokenMinter: params.NFTokenMinter } : {}),
      ...(params.setFlag ? { SetFlag: params.setFlag } : {}),
      ...(params.transferRate ? { TransferRate: params.transferRate } : {}),
      ...(params.tickSize ? { TickSize: params.tickSize } : {})
    },
    params.fee
  );
  const { hasEnoughFunds, transactionStatusComponent } = useTransactionStatus({
    isParamsMissing,
    errorFees,
    network: networkName,
    difference,
    transaction,
    errorRequestRejection
  });

  const createMessage = useCallback(
    (messagePayload: {
      hash: string | null | undefined;
      error?: Error;
    }): ReceiveSetAccountBackgroundMessage => {
      const { hash, error } = messagePayload;

      return {
        app: GEM_WALLET,
        type: 'RECEIVE_SET_ACCOUNT/V3',
        payload: {
          id: params.id,
          type: ResponseType.Response,
          result: hash
            ? {
                hash: hash
              }
            : undefined,
          error: error ? serializeError(error) : undefined
        }
      };
    },
    [params.id]
  );

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = Number(urlParams.get('id')) || 0;

    // BaseTransaction fields
    const {
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature
    } = parseBaseParamsFromURLParams(urlParams);

    // SetAccount fields
    const flags = parseSetAccountFlags(urlParams.get('flags'));
    const clearFlag = Number(urlParams.get('clearFlag')) || null;
    const domain = urlParams.get('domain');
    const emailHash = urlParams.get('emailHash');
    const messageKey = urlParams.get('messageKey');
    const NFTokenMinter = urlParams.get('NFTokenMinter');
    const setFlag = Number(urlParams.get('setFlag')) || null;
    const transferRate = Number(urlParams.get('transferRate')) || null;
    const tickSize = Number(urlParams.get('tickSize')) || null;

    if (
      !flags &&
      !clearFlag &&
      !domain &&
      !emailHash &&
      !messageKey &&
      !NFTokenMinter &&
      !setFlag &&
      !transferRate &&
      !tickSize
    ) {
      setIsParamsMissing(true);
    }

    setParams({
      id,
      // BaseTransaction fields
      fee,
      sequence,
      accountTxnID,
      lastLedgerSequence,
      memos,
      signers,
      sourceTag,
      signingPubKey,
      ticketSequence,
      txnSignature,
      // SetAccount fields
      flags,
      clearFlag,
      domain,
      emailHash,
      messageKey,
      NFTokenMinter,
      setFlag,
      transferRate,
      tickSize
    });
  }, []);

  const handleReject = useCallback(() => {
    setTransaction(TransactionStatus.Rejected);
    const message = createMessage({
      hash: null
    });
    chrome.runtime.sendMessage<ReceiveSetAccountBackgroundMessage>(message);
  }, [createMessage]);

  const handleConfirm = useCallback(() => {
    setTransaction(TransactionStatus.Pending);
    // NFTokenID will be present because if not,
    // we won't be able to go to the confirm transaction state
    setAccount({
      // BaseTransaction fields
      ...getBaseFromParams(params),
      // SetAccount fields
      flags: params.flags || undefined,
      clearFlag: params.clearFlag || undefined,
      domain: params.domain || undefined,
      emailHash: params.emailHash || undefined,
      messageKey: params.messageKey || undefined,
      NFTokenMinter: params.NFTokenMinter || undefined,
      setFlag: params.setFlag || undefined,
      transferRate: params.transferRate || undefined,
      tickSize: params.tickSize || undefined
    })
      .then((response) => {
        setTransaction(TransactionStatus.Success);
        chrome.runtime.sendMessage<ReceiveSetAccountBackgroundMessage>(createMessage(response));
      })
      .catch((e) => {
        setErrorRequestRejection(e.message);
        setTransaction(TransactionStatus.Rejected);
        const message = createMessage({
          hash: undefined,
          error: e
        });
        chrome.runtime.sendMessage<ReceiveSetAccountBackgroundMessage>(message);
      });
  }, [setAccount, params, createMessage]);

  const {
    // Base transaction params
    fee,
    memos,
    // SetAccount params
    flags,
    clearFlag,
    domain,
    emailHash,
    messageKey,
    NFTokenMinter,
    setFlag,
    transferRate,
    tickSize
  } = params;

  const decodedMemos = fromHexMemos(memos || []) || [];

  return (
    <>
      {transactionStatusComponent ? (
        <div>{transactionStatusComponent}</div>
      ) : (
        <PageWithTitle title="Set Account" styles={{ container: { justifyContent: 'initial' } }}>
          {!hasEnoughFunds ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ErrorIcon style={{ color: ERROR_RED }} />
              <Typography variant="body1" style={{ marginLeft: '10px', color: ERROR_RED }}>
                Insufficient funds.
              </Typography>
            </div>
          ) : null}
          {clearFlag ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Flag to be cleared:</Typography>
              <Typography variant="body2">{clearFlag}</Typography>
            </Paper>
          ) : null}
          {setFlag ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Flag to be set:</Typography>
              <Typography variant="body2">{setFlag}</Typography>
            </Paper>
          ) : null}
          {domain ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Domain:</Typography>
              <Typography variant="body2">{domain}</Typography>
            </Paper>
          ) : null}
          {emailHash ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Email hash:</Typography>
              <Typography variant="body2">{emailHash}</Typography>
            </Paper>
          ) : null}
          {messageKey ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Message key:</Typography>
              <Typography variant="body2">{messageKey}</Typography>
            </Paper>
          ) : null}
          {NFTokenMinter ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">NFT Token Minter:</Typography>
              <Typography
                variant="body2"
                style={{
                  wordBreak: 'break-word'
                }}
              >
                {NFTokenMinter}
              </Typography>
            </Paper>
          ) : null}
          {transferRate ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Transfer rate:</Typography>
              <Typography variant="body2">{transferRate}</Typography>
            </Paper>
          ) : null}
          {tickSize ? (
            <Paper elevation={24} style={{ padding: '10px', marginBottom: '5px' }}>
              <Typography variant="body1">Tick size:</Typography>
              <Typography variant="body2">{tickSize}</Typography>
            </Paper>
          ) : null}
          <div style={{ marginBottom: '40px' }}>
            <BaseTransaction
              fee={fee ? Number(fee) : null}
              memos={decodedMemos}
              flags={flags}
              errorFees={errorFees}
              estimatedFees={estimatedFees}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#1d1d1d'
            }}
          >
            <Container style={{ display: 'flex', justifyContent: 'space-evenly', margin: '10px' }}>
              <Button variant="contained" color="secondary" onClick={handleReject}>
                Reject
              </Button>
              <Button variant="contained" onClick={handleConfirm} disabled={!hasEnoughFunds}>
                Confirm
              </Button>
            </Container>
          </div>
        </PageWithTitle>
      )}
    </>
  );
};
