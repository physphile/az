import AdmZip from 'adm-zip';
import { prisma } from '~/prisma';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { Sheet } from '@prisma/client';

export default defineEventHandler(async event => {
	const id = Number(getRouterParam(event, 'id'));

	const { sheets, title } = await prisma.sheetset.findFirstOrThrow({
		where: { id },
		select: {
			title: true,
			sheets: {
				include: {
					sheet: {
						select: {
							filePath: true,
							title: true,
						},
					},
				},
			},
		},
	});

	const zip = new AdmZip();

	const flattenedSheets: Pick<Sheet, 'title' | 'filePath'>[] = new Array(sheets.length);
	sheets.forEach(s => (flattenedSheets[s.index] = s.sheet));

	flattenedSheets.forEach(async ({ title, filePath }, i) => {
		const file = readFileSync(resolve(process.cwd(), 'public', filePath.slice(1)));
		zip.addFile(`${i + 1}. ${title}.pdf`, file);
	});

	const buffer = zip.toBuffer();

	setResponseHeaders(event, {
		'Content-Disposition': `attachment; filename="${encodeURI(title)}.zip"`,
		'Content-Type': 'application/zip',
	});

	return buffer;
});
