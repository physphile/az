import { lz } from './lz';

export const dateToIso = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${lz(month)}-${lz(day)}`;
};
