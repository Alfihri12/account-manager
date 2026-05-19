type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
	id: number;
	message: string;
	variant: ToastVariant;
};

let toasts = $state<ToastItem[]>([]);

export function useToastStore() {
	function show(message: string, variant: ToastVariant = 'info') {
		const toast = {
			id: Date.now(),
			message,
			variant
		};

		toasts = [...toasts, toast];

		if (browser) {
			window.setTimeout(() => dismiss(toast.id), 3000);
		}
	}

	function success(message: string) {
		show(message, 'success');
	}

	function error(message: string) {
		show(message, 'error');
	}

	function dismiss(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}

	return {
		get toasts() {
			return toasts;
		},
		show,
		success,
		error,
		dismiss
	};
}
import { browser } from '$app/environment';
