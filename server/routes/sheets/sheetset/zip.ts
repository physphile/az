import AdmZip from 'adm-zip';
import { prisma } from '~/prisma';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { dateToIso } from '~/utils/dateToIso';

export default defineEventHandler(async event => {
	const query = getQuery(event);
	const sheetIds = (query.id as string[]).map(Number);
	const title = query.title as string;

	const sheets = await prisma.sheet.findMany({
		where: {
			id: {
				in: sheetIds,
			},
		},
		select: {
			id: true,
			title: true,
			filePath: true,
		},
	});

	const sortedSheets = sheetIds.map(id => sheets.find(s => s.id === id)!);

	const zip = new AdmZip();

	sortedSheets.forEach(async ({ filePath, title }, i) => {
		const file = readFileSync(resolve(process.cwd(), 'public', filePath.slice(1)));
		zip.addFile(`${i + 1}. ${title}.pdf`, file);
	});

	const buffer = zip.toBuffer();

	setResponseHeaders(event, {
		'Content-Disposition': `attachment; filename="${encodeURI(
			title || dateToIso(new Date())
		)}.zip"`,
		'Content-Type': 'application/zip',
	});

	return buffer;
});
