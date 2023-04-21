import { DEFAULT_MEMO_TYPE } from '../constants/payload';

export const buildMemos = (memoData: string | undefined): { Memo: { MemoType: string; MemoData: string } }[] | undefined => {
  if (memoData === undefined || memoData === '') return undefined;
  return [
    {
      Memo: {
        MemoType: Buffer.from(DEFAULT_MEMO_TYPE, 'utf8').toString('hex').toUpperCase(),
        MemoData: Buffer.from(memoData, 'utf8').toString('hex').toUpperCase()
      }
    }
  ];
}

export const buildDestinationTag = (destinationTag: string | undefined): number | undefined => {
  if (destinationTag === undefined || destinationTag === '') return undefined;
  return Number(destinationTag);
}