export const toSelectItems = (map: Record<string, string>) =>
	Object.entries(map).map(([key, value]) => ({
		title: value,
		value: key,
	}));
