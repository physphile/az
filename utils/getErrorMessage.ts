import { FetchError } from 'ofetch';

export const getErrorMessage = (err: any) => {
	if (err instanceof FetchError) {
		if (err.data instanceof Object && 'message' in err.data) {
			return err.data.message;
		}
		return err.message;
	}
	return 'Неизвестная ошибка';
};
