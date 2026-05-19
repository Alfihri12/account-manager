import { ACTIVE_ADAPTER } from '$lib/repositories/adapter-mode';
import * as localAdapter from '$lib/repositories/adapters/local-email-adapter';
import * as tauriAdapter from '$lib/repositories/adapters/tauri-email-adapter';

const adapter = ACTIVE_ADAPTER === 'tauri' ? tauriAdapter : localAdapter;

export const getEmailsSnapshot = adapter.getEmailsSnapshot;
export const getEmails = adapter.getEmails;
export const createEmail = adapter.createEmail;
export const updateEmail = adapter.updateEmail;
export const deleteEmail = adapter.deleteEmail;
export const replaceEmails = adapter.replaceEmails;
export const resetEmailsToDefault = adapter.resetEmailsToDefault;
export const clearEmails = adapter.clearEmails;
