import { Service } from '@prisma/client';
import { z } from 'zod';

export const createSheetsetSchema = z
	.object({
		title: z.string().trim().min(1),
		sheetIds: z.number().int().array().nonempty(),
	})
	.merge(
		z
			.object({
				description: z.string(),
				service: z.nativeEnum(Service),
				date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Дата должна быть в формате 2024-03-14'),
			})
			.partial()
	);
