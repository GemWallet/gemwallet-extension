import { STORAGE_TRUSTED_APPS } from '../constants/localStorage';
import { loadData, saveData } from '.';

export interface TrustedApp {
  url: string;
}

export const saveTrustedApp = (trustedApp: TrustedApp) => {
  const trustedApps: Array<TrustedApp> = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[]');

  if (trustedApps.findIndex((tApp) => tApp.url === trustedApp.url) === -1) {
    trustedApps.push(trustedApp);
    const stringifiedTrustedApps = JSON.stringify(trustedApps);
    try {
      saveData(STORAGE_TRUSTED_APPS, stringifiedTrustedApps);
    } catch (e) {
      throw e;
    }
  }
};

export const loadTrustedApps = (): TrustedApp[] => {
  const data = loadData(STORAGE_TRUSTED_APPS);
  if (data) {
    return JSON.parse(data);
  }
  return [];
};

export const removeTrustedApp = (trustedApp: TrustedApp) => {
  let trustedApps: TrustedApp[] = JSON.parse(loadData(STORAGE_TRUSTED_APPS) || '[]');
  trustedApps = trustedApps.filter((app) => app.url !== trustedApp.url);
  const stringifiedTrustedApps = JSON.stringify(trustedApps);
  try {
    saveData(STORAGE_TRUSTED_APPS, stringifiedTrustedApps);
  } catch (e) {
    throw e;
  }
  return trustedApps;
};
