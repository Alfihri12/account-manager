import { ACTIVE_ADAPTER } from '$lib/repositories/adapter-mode';
import * as localAdapter from '$lib/repositories/adapters/local-account-adapter';
import * as tauriAdapter from '$lib/repositories/adapters/tauri-account-adapter';

const adapter = ACTIVE_ADAPTER === 'tauri' ? tauriAdapter : localAdapter;

export const getAccountsSnapshot = adapter.getAccountsSnapshot;
export const getAccounts = adapter.getAccounts;
export const createAccount = adapter.createAccount;
export const updateAccount = adapter.updateAccount;
export const deleteAccount = adapter.deleteAccount;
export const getAccountsByEmail = adapter.getAccountsByEmail;
export const replaceAccounts = adapter.replaceAccounts;
export const resetAccountsToDefault = adapter.resetAccountsToDefault;
export const clearAccounts = adapter.clearAccounts;
