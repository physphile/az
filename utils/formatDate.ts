export const formatDate = (date: string) =>
	new Date(date).toLocaleString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' });
