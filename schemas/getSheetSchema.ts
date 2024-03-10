import { Tonality, Key, Language, Service, Choir, Soloist } from '@prisma/client';
import { z } from 'zod';

export const getSheetSchema = z
	.object({
		limit: z.number().int().default(10),
		offset: z.number().int().default(0),
		orderBy: z
			.object({
				voices: z.literal('asc').or(z.literal('desc')).optional(),
				writtenIn: z.literal('asc').or(z.literal('desc')).optional(),
			})
			.optional(),
		sheet: z
			.object({
				title: z.string(),
				author: z.string(),
				arranger: z.string(),
				typesetter: z.string(),
				variant: z.string(),
				tonality: z.nativeEnum(Tonality),
				writtenIn: z.number().int(),
				key: z.nativeEnum(Key),
				language: z.nativeEnum(Language),
				translit: z.nativeEnum(Language),
				holiday: z.string(),
				service: z.nativeEnum(Service),
				text: z.string(),
				alias: z.string(),
				choir: z.nativeEnum(Choir),
				voices: z.number().int(),
				book: z.string(),
				soloist: z.nativeEnum(Soloist),
			})
			.partial()
			.optional(),
	})
	.optional();
