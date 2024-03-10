import type { Sheet as PrismaSheet } from '@prisma/client';

type Sheet = Omit<PrismaSheet, 'createdAt' | 'updatedAt'> & {
	createdAt: string;
	updatedAt: string;
};

export const useSheetset = defineStore('sheetset', () => {
	const sheets = ref<Sheet[]>([]);
	const length = computed(() => sheets.value.length);

	function push(sheet: Sheet) {
		sheets.value.push(sheet);
	}

	function remove(sheetId: number) {
		sheets.value.splice(
			sheets.value.findIndex(s => s.id === sheetId),
			1
		);
	}

	function clear() {
		sheets.value = []
	}

	function has(sheetId: number) {
		return Boolean(sheets.value.find(s => s.id === sheetId));
	}

	return {
		sheets,
		push,
		remove,
		length,
		has,
		clear,
	};
});
