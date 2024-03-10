import { writeFile } from 'node:fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';
import md5 from 'md5';

export default defineEventHandler(async event => {
	const files = await readMultipartFormData(event);
	const file = files?.[0];

	if (!file) {
		throw createError({
			message: 'Ошибка при чтении данных файла.',
			statusCode: 500,
		});
	}

	if (file.type !== 'application/pdf') {
		throw createError({
			message: `Ожидался тип application/pdf для файла партитуры, получен ${file.type}`,
			statusCode: 406,
		});
	}

	const path = `public/sheets/${md5(file.data)}.pdf`;
	const fullPath = resolve(process.cwd(), path);

	let isThere = false;
	try {
		isThere = existsSync(fullPath);
	} catch (err) {
		throw createError({
			message: 'Ошибка при проверке файла на дубликат.',
			statusCode: 500,
		});
	}
	if (isThere) {
		throw createError({
			message: 'Такая партитура уже присутствует на сервере.',
			statusCode: 409,
		});
	}

	try {
		await writeFile(resolve(process.cwd(), path), file.data);
		return path.slice(6); // отрезаем public
	} catch (err) {
		throw createError({
			message: 'Ошибка при записи файла партитуры.',
			statusCode: 500,
		});
	}
});
