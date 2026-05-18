import type { Category, Status } from '$lib/types/account';

export function getCategoryIcon(category: Category) {
	const icons: Record<Category, string> = {
		game: '🎮',
		sosmed: '🌐',
		dev: '💻',
		freelance: '🧾',
		education: '🎓',
		other: '📦'
	};

	return icons[category];
}

export function getStatusLabel(status: Status) {
	const labels: Record<Status, string> = {
		active: 'Aktif',
		need_check: 'Perlu dicek',
		inactive: 'Nonaktif',
		lost: 'Hilang'
	};

	return labels[status];
}
