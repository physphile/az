import {
  Key,
  Language,
  Service,
  Choir,
  Soloist,
  Tonality,
} from '@prisma/client';
import { z } from 'zod';

export const createSheetSchema = z
  .object({
    title: z.string().trim().min(1, 'Необходимо назвать партитуру'),
    filePath: z.string(),
    thumbnailPath: z.string(),
  })
  .merge(
    z
      .object({
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
  );
