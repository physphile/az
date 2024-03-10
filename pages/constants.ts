import { Service } from '@prisma/client';
import { Tonality, Choir, Soloist, Language, Key } from '@prisma/client';
import { toSelectItems } from '~/utils/toSelectItems';

export const serviceColorMap = {
	[Service.Liturgy]: '#5E2129',
	[Service.Matins]: '#C6DBD6',
	[Service.Vespers]: '#5B466D',
	[Service.Compline]: '#192436',
	[Service.Vigil]: '#000'
};

export const tonalityMap = {
	[Tonality.C]: 'До',
	[Tonality.CS]: 'До♯',
	[Tonality.DF]: 'Ре♭',
	[Tonality.D]: 'Ре',
	[Tonality.DS]: 'Ре♯',
	[Tonality.EF]: 'Ми♭',
	[Tonality.E]: 'Ми',
	[Tonality.F]: 'Фа',
	[Tonality.FS]: 'Фа♯',
	[Tonality.G]: 'Соль',
	[Tonality.GS]: 'Соль♯',
	[Tonality.AF]: 'Ля♭',
	[Tonality.A]: 'Ля',
	[Tonality.AS]: 'Ля♯',
	[Tonality.B]: 'Си♭',
	[Tonality.H]: 'Си',
};
export const tonalityItems = toSelectItems(tonalityMap);

export const choirMap = {
	[Choir.Mixed]: 'Смешанный хор',
	[Choir.Male]: 'Мужской хор',
	[Choir.Female]: 'Женский хор',
	[Choir.Children]: 'Детский хор',
	[Choir.Dual]: 'Два хора',
};
export const choirItems = toSelectItems(choirMap);

export const soloistMap = {
	[Soloist.Soprano]: 'Сопрано',
	[Soloist.Alto]: 'Альт',
	[Soloist.Tenor]: 'Тенор',
	[Soloist.Baritone]: 'Баритон',
	[Soloist.Bass]: 'Бас',
	[Soloist.Profundo]: 'Бас профундо',
	[Soloist.Multiple]: 'Несколько солистов',
};
export const soloistItems = toSelectItems(soloistMap);

export const serviceMap = {
	[Service.Liturgy]: 'Литургия',
	[Service.Vespers]: 'Вечерня',
	[Service.Matins]: 'Утреня',
	[Service.Compline]: 'Повечерие',
	[Service.Vigil]: 'Всенощная'
};
export const serviceItems = toSelectItems(serviceMap);

export const languageMap = {
	[Language.Russian]: 'Русский',
	[Language.ChurchSlavonic]: 'Церковнославянский',
	[Language.Georgian]: 'Грузинский',
	[Language.Latin]: 'Латинский',
	[Language.English]: 'Английский',
	[Language.Greek]: 'Греческий',
};

export const languageItems = toSelectItems(languageMap);

export const keyMap = {
	[Key.Dur]: 'Мажор',
	[Key.Moll]: 'Минор',
};
