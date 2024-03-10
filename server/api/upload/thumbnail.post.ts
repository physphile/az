import { writeFile } from 'node:fs/promises';
import { resolve } from 'path';
import md5 from 'md5';

const thumbnailType = 'png';

export default defineEventHandler(async event => {
	const files = await readMultipartFormData(event);
	const thumbnail = files?.[0];

	if (!thumbnail) {
		throw new Error('Ошибка при чтении данных изображения.');
	}

	if (thumbnail.type !== `image/${thumbnailType}`) {
		throw new Error(
			`Ожидался тип image/${thumbnailType} для файла изаображения, получен ${thumbnail.type}.`
		);
	}

	try {
		const path = `public/sheets/${md5(thumbnail.data)}.${thumbnailType}`;
		await writeFile(resolve(process.cwd(), path), thumbnail.data);
		return path.slice(6); // отрезаем public
	} catch (err) {
		throw new Error('Ошибка при записи изображения.');
	}
});
