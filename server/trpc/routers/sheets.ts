import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { prisma } from '~/prisma';
import { createSheetSchema } from '~/schemas/createSheetSchema';
import { getSheetSchema } from '~/schemas/getSheetSchema';

export const sheetsRouter = router({
	getMany: publicProcedure.input(getSheetSchema).query(({ input }) => {
		return prisma.sheet.findMany({
			skip: input?.offset ?? 0,
			take: input?.limit ?? 10,
			orderBy: input?.orderBy ?? {},
			where: {
				choir: input?.sheet?.choir,
				key: input?.sheet?.key,
				language: input?.sheet?.language,
				translit: input?.sheet?.translit,
				tonality: input?.sheet?.tonality,
				service: input?.sheet?.service,
				writtenIn: input?.sheet?.writtenIn,
				voices: input?.sheet?.voices,
				variant: input?.sheet?.variant,
				soloist: input?.sheet?.soloist,
				alias: {
					contains: input?.sheet?.alias,
				},
				arranger: {
					contains: input?.sheet?.arranger,
				},
				author: {
					contains: input?.sheet?.author,
				},
				book: {
					contains: input?.sheet?.book,
				},
				holiday: {
					contains: input?.sheet?.holiday,
				},
				title: {
					contains: input?.sheet?.title,
				},
				text: {
					contains: input?.sheet?.text,
				},
				typesetter: {
					contains: input?.sheet?.typesetter,
				},
			},
		});
	}),
	create: publicProcedure.input(createSheetSchema).mutation(async ({ input: sheet }) => {
		return prisma.sheet.create({
			data: {
				filePath: sheet.filePath,
				thumbnailPath: sheet.thumbnailPath,
				title: sheet.title,
				alias: sheet.alias,
				arranger: sheet.arranger,
				author: sheet.author,
				book: sheet.book,
				choir: sheet.choir,
				holiday: sheet.holiday,
				key: sheet.key,
				language: sheet.language,
				service: sheet.service,
				text: sheet.text,
				tonality: sheet.tonality,
				writtenIn: sheet.writtenIn,
				voices: sheet.voices,
				variant: sheet.variant,
				typesetter: sheet.typesetter,
				translit: sheet.translit,
				soloist: sheet.soloist,
			},
		});
	}),
	search: publicProcedure.input(z.string()).query(({ input: query }) => {
		return prisma.sheet.findMany({
			where: {
				title: {
					mode: 'insensitive',
					contains: query,
				},
			},
		});
	}),
});
