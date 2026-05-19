import type { AccountItem, EmailItem } from '$lib/types/account';
import { getStatusLabel } from '$lib/utils/account';

export function accountToMarkdown(account: AccountItem, email?: EmailItem) {
	return `# ${account.name}\n\nKategori: ${account.category}\nPlatform: ${account.platform}\nUsername: ${account.username}\nLogin via: ${account.loginMethod}\nEmail Terhubung: [[${email?.label ?? '-'}]]\nPassword: lihat ${account.passwordLocation}\n2FA: ${account.twoFactor ? 'Aktif' : 'Belum aktif'}\nStatus: ${getStatusLabel(account.status)}\n\n## Catatan\n${account.notes}\n`;
}
