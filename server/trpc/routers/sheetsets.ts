import { prisma } from '~/prisma';
import { publicProcedure, router } from '../trpc';
import { createSheetsetSchema } from '~/schemas/createSheetsetSchema';
import { z } from 'zod';
import { Sheet } from '@prisma/client';

export const sheetsetsRouter = router({
	get: publicProcedure.input(z.number().int()).query(async ({ input: id }) => {
		const sheetset = await prisma.sheetset.findFirstOrThrow({
			where: { id },
			include: {
				sheets: {
					include: {
						sheet: true,
					},
				},
			},
		});
		const sheets: Sheet[] = new Array(sheetset.sheets.length);
		sheetset.sheets.forEach(s => (sheets[s.index] = s.sheet));
		const flattenedSheetset = { ...sheetset, sheets };
		return flattenedSheetset;
	}),
	getMany: publicProcedure.query(async () => {
		const sheetsets = await prisma.sheetset.findMany({
			include: {
				sheets: {
					include: {
						sheet: true,
					},
				},
			},
		});
		const flattenedSheetsets = sheetsets.map(ss => {
			const sheets: Sheet[] = new Array(ss.sheets.length);
			ss.sheets.forEach(s => (sheets[s.index] = s.sheet));
			const flattenedSheetset = { ...ss, sheets };
			return flattenedSheetset;
		});
		return flattenedSheetsets;
	}),
	create: publicProcedure
		.input(createSheetsetSchema)
		.mutation(({ input: { sheetIds, title, date, description, service } }) => {
			return prisma.sheetset.create({
				data: {
					title,
					date,
					description,
					service,
					sheets: {
						create: sheetIds.map((sheetId, index) => ({ sheetId, index })),
					},
				},
			});
		}),
	delete: publicProcedure.input(z.number().int()).mutation(async ({ input: id }) => {
		await prisma.sheetsOnSheetsets.deleteMany({
			where: {
				sheetsetId: id,
			},
		});
		return prisma.sheetset.delete({
			where: { id },
		});
	}),
	search: publicProcedure.input(z.string()).query(({ input: query }) => {
		return prisma.sheetset.findMany({
			where: {
				title: {
					contains: query,
					mode: 'insensitive',
				},
			},
		});
	}),
});
