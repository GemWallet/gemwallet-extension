export type Message = {
  app: 'gem-wallet';
  type: 'transaction-emit' | 'transaction-success';
  parameters: string;
};

export type CurrentWindow = chrome.windows.Window | undefined;
