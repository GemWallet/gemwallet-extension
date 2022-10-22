import { STORAGE_TRUSTED_APPS } from '../constants/localStorage';
import { loadData, removeData, saveData } from '.';

export enum Permission {
  Address = 'address',
  PublicKey = 'public-key'
}
export interface TrustedApp {
  // The URL acts as a unique key
  url: string;
  // Permissions are the permissions allowed for the URL
  permissions: Permission[];
}

export const saveTrustedApp = (trustedApp: TrustedApp, walletIndex: number): void => {
  const trustedApps: TrustedApp[][] = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');

  if (!trustedApps[walletIndex]) {
    throw new Error("Couldn't find the wallet while saving the trusted app");
  }

  const previousTrustedAppIndex = trustedApps[walletIndex].findIndex(
    (tApp) => tApp.url === trustedApp.url
  );

  const previousTrustedApp = trustedApps[walletIndex][previousTrustedAppIndex] || {
    url: trustedApp.url,
    permissions: []
  };

  const newTrustedApp = {
    url: trustedApp.url,
    permissions: [...new Set([...previousTrustedApp.permissions, ...trustedApp.permissions])]
  };

  // We update the trustedApp if it already exist
  if (previousTrustedAppIndex !== -1) {
    trustedApps[walletIndex][previousTrustedAppIndex] = newTrustedApp;
    // Else we just push the newTrustedApp
  } else {
    trustedApps[walletIndex].push(newTrustedApp);
  }

  const stringifiedNewTrustedApps = JSON.stringify(trustedApps);

  try {
    saveData(STORAGE_TRUSTED_APPS, stringifiedNewTrustedApps);
  } catch (e) {
    throw e;
  }
};

export const loadTrustedApps = (walletIndex: number): TrustedApp[] => {
  const data = loadData(STORAGE_TRUSTED_APPS);
  if (data) {
    return JSON.parse(data)[walletIndex];
  }
  return [];
};

export const removeTrustedApp = (url: string, walletIndex: number): TrustedApp[] => {
  let trustedApps: TrustedApp[][] = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[[]]');

  if (!trustedApps[walletIndex]) {
    throw new Error("Couldn't find the wallet while removing the trusted app");
  }

  trustedApps[walletIndex] = trustedApps[walletIndex].filter((app) => app.url !== url);

  // If there are no other trusted app we completely remove all the data
  if (trustedApps[walletIndex].length === 0) {
    removeData(STORAGE_TRUSTED_APPS);
  } else {
    const stringifiedTrustedApps = JSON.stringify(trustedApps);
    try {
      saveData(STORAGE_TRUSTED_APPS, stringifiedTrustedApps);
    } catch (e) {
      throw e;
    }
  }

  return trustedApps[walletIndex];
};

// Checks if the trustedApp includes all the permissions
export const checkPermissions = (trustedApp: TrustedApp, permissions: Permission[]): boolean => {
  return permissions.every((permission) => trustedApp.permissions.includes(permission));
};
