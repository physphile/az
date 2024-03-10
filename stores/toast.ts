interface Toast {
	id: number;
	type: 'success' | 'info' | 'warning' | 'error';
	title: string;
	text?: string;
	timeout?: NodeJS.Timeout;
}

const generateId = () => Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

export const useToasts = defineStore('toast', () => {
	const toasts = ref<Map<number, Toast>>(new Map());

	function push(toast: Omit<Toast, 'id'>, timeout = 3000) {
		const id = generateId();
		toasts.value.set(id, {
			id,
			timeout: setTimeout(() => remove(id), timeout),
			...toast,
		});
	}

	function remove(id: number) {
		const toast = toasts.value.get(id);
		if (!toast) return;
		if (toast.timeout) {
			clearTimeout(toast.timeout);
		}
		toasts.value.delete(id);
	}

	return { push, remove, toasts };
});
