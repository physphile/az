import { router } from '../trpc';
import { sheetsRouter } from './sheets';
import { sheetsetsRouter } from './sheetsets';

export const appRouter = router({
	sheets: sheetsRouter,
	sheetsets: sheetsetsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
