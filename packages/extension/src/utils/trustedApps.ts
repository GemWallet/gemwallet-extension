import { STORAGE_TRUSTED_APPS } from '../constants/localStorage';
import { loadData, saveData } from '.';

export interface TrustedApp {
  url: string;
}

export const saveTrustedApp = (trustedApp: TrustedApp, walletIndex: number): void => {
  const trustedApps: TrustedApp[][] = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');

  if (!trustedApps[walletIndex]) {
    throw new Error("Couldn't find the wallet within saveTrustedApp");
  }

  if (trustedApps[walletIndex].findIndex((tApp) => tApp.url === trustedApp.url) === -1) {
    trustedApps[walletIndex].push(trustedApp);
    const stringifiedTrustedApps = JSON.stringify(trustedApps);
    try {
      saveData(STORAGE_TRUSTED_APPS, stringifiedTrustedApps);
    } catch (e) {
      throw e;
    }
  }
};

export const loadTrustedApps = (walletIndex: number): TrustedApp[] => {
  const data = loadData(STORAGE_TRUSTED_APPS);
  if (data) {
    return JSON.parse(data)[walletIndex];
  }
  return [];
};

export const removeTrustedApp = (trustedApp: TrustedApp, walletIndex: number): TrustedApp[] => {
  let trustedApps: TrustedApp[][] = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');
  if (!trustedApps[walletIndex]) {
    throw new Error("Couldn't find the wallet within saveTrustedApp");
  }
  trustedApps[walletIndex] = trustedApps[walletIndex].filter((app) => app.url !== trustedApp.url);
  const stringifiedTrustedApps = JSON.stringify(trustedApps);
  try {
    saveData(STORAGE_TRUSTED_APPS, stringifiedTrustedApps);
  } catch (e) {
    throw e;
  }
  return trustedApps[walletIndex];
};
