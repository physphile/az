<script setup lang="ts">
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';
import { useField, useForm } from 'vee-validate';
import { createSheetSchema } from '~/schemas/createSheetSchema';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { Choir, Key, Language, Service, Soloist, Tonality } from '@prisma/client';
import {
	choirItems,
	languageItems,
	serviceItems,
	soloistItems,
	tonalityItems,
} from '../../constants';
import { getErrorMessage } from '~/utils/getErrorMessage';

GlobalWorkerOptions.workerSrc = pdfWorker;

const { $client } = useNuxtApp();
const toasts = useToasts();

const PDF_SCALE = 2;

const canvas = ref<HTMLCanvasElement | null>(null);
const form = ref<HTMLFormElement | null>(null);

const { handleSubmit, resetForm } = useForm({
	validationSchema: toTypedSchema(
		createSheetSchema
			.omit({
				filePath: true,
				thumbnailPath: true,
			})
			.merge(
				z.object({
					files: z.instanceof(File).array().nonempty('Необходимо загрузить pdf-файл'),
				})
			)
	),
	initialValues: {
		alias: '',
		arranger: '',
		author: '',
		book: '',
		files: [],
		holiday: '',
		choir: undefined,
		key: undefined,
		language: undefined,
		service: undefined,
		soloist: undefined,
		text: '',
		title: '',
		tonality: undefined,
		translit: undefined,
		typesetter: '',
		variant: '',
		voices: undefined,
		writtenIn: undefined,
	},
});

const files = useField<File[]>('files');
const title = useField<string>('title');
const author = useField<string>('author');
const arranger = useField<string>('arranger');
const typesetter = useField<string>('typesetter');
const variant = useField<string>('variant');
const tonality = useField<Tonality | undefined>('tonality');
const writtenInField = useField<number | undefined>('writtenIn');
const writtenIn = computed({
	get() {
		return writtenInField.value.value?.toString() ?? '';
	},

	set(value: string | undefined) {
		if (!value || isNaN(Number(value))) {
			writtenInField.value.value = undefined;
		} else {
			writtenInField.value.value = Number(value);
		}
	},
});
const key = useField<Key | undefined>('key');
const language = useField<Language | undefined>('language');
const translit = useField<Language | undefined>('translit');
const holiday = useField<string>('holiday');
const service = useField<Service | undefined>('service');
const text = useField<string>('text');
const alias = useField<string>('alias');
const choir = useField<Choir | undefined>('choir');
const voicesField = useField<number | undefined>('voices');
const voices = computed({
	get() {
		return voicesField.value.value?.toString() ?? '';
	},
	set(value: string | undefined) {
		if (!value || isNaN(Number(value))) {
			voicesField.value.value = undefined;
		} else {
			voicesField.value.value = Number(value);
		}
	},
});
const book = useField<string>('book');
const soloist = useField<Soloist | undefined>('soloist');

async function renderPreview(file: File) {
	if (!canvas.value) {
		throw new Error('Ошибка при добавлении canvas.');
	}
	const doc = await getDocument(await file.arrayBuffer()).promise;
	const page = await doc.getPage(1);
	const viewport = page.getViewport({ scale: PDF_SCALE });
	page.render({ canvasContext: canvas.value.getContext('2d')!, viewport });
	return canvas.value.toDataURL('image/png');
}

function getThumbnailUrl() {
	if (!canvas.value) {
		throw new Error('Ошибка при работе с canvas.');
	}
	return canvas.value.toDataURL();
}

const submitHandler = handleSubmit(async values => {
	const fileData = new FormData();
	fileData.append('file', values.files[0]);

	const thumbnail = getThumbnailUrl();
	const thumbnailData = new FormData();
	const blob = base64toBlob(thumbnail);
	const thumbnailFile = new File([blob], 'thumbnail.png', {
		type: 'image/png',
	});
	thumbnailData.append('file', thumbnailFile);

	try {
		const filePath = await $fetch('/api/upload/sheet', {
			method: 'POST',
			body: fileData,
		});

		const thumbnailPath = await $fetch('/api/upload/thumbnail', {
			method: 'POST',
			body: thumbnailData,
		});

		await $client.sheets.create.mutate({
			filePath: filePath,
			thumbnailPath: thumbnailPath,
			title: values.title,
			alias: values.alias || undefined,
			arranger: values.alias || undefined,
			author: values.author || undefined,
			book: values.book || undefined,
			choir: values.choir,
			holiday: values.holiday || undefined,
			key: values.key,
			language: values.language,
			service: values.service,
			soloist: values.soloist,
			text: values.text || undefined,
			tonality: values.tonality,
			translit: values.translit,
			typesetter: values.typesetter || undefined,
			variant: values.variant || undefined,
			voices: values.voices,
			writtenIn: values.writtenIn,
		});
		toasts.push({
			type: 'success',
			title: 'Партитура успешно загружена',
			text: values.title,
		});
		resetForm();
		clearPreview();
	} catch (err) {
		toasts.push({
			type: 'error',
			title: getErrorMessage(err),
		});
	}
});

function clearPreview() {
	const ctx = canvas.value?.getContext('2d');
	if (!ctx) {
		throw new Error('Ошибка при работе с canvas.');
	}
	ctx.clearRect(0, 0, 1190, 1683);
}

watch(
	() => files.value.value,
	async val => {
		if (val.length) {
			await renderPreview(val[0]);
		} else {
			clearPreview();
		}
	}
);

const decrement = () => {
	if (voicesField.value.value) {
		voicesField.value.value = Math.max(voicesField.value.value - 1, 1);
	} else {
		voicesField.value.value = 1;
	}
};

const increment = () => {
	if (voicesField.value.value) {
		voicesField.value.value++;
	} else {
		voicesField.value.value = 1;
	}
};
</script>
<template>
	<v-container>
		<v-sheet class="mx-auto" max-width="700" style="background: var(--v-theme-background)">
			<v-sheet :class="$style.sheet" class="mx-auto bg" elevation="2" rounded>
				<canvas ref="canvas" :class="$style.canvas" width="1190" height="1683" />
			</v-sheet>
			<v-form @submit.prevent="submitHandler" class="d-flex flex-column ga-5" ref="form">
				<v-sheet border rounded class="px-4 pt-5 pb-2">
					<v-file-input
						label="Файл*"
						accept="application/pdf"
						v-model="files.value.value"
						:error-messages="files.errorMessage.value"
						prepend-icon="mdi-file-pdf-box"
						required
					/>
					<v-text-field
						v-model="title.value.value"
						:error-messages="title.errorMessage.value"
						label="Название*"
						@click:clear="title.value.value = ''"
						required
					/>
				</v-sheet>
				<v-sheet border rounded class="pt-5 pb-2">
					<v-text-field
						v-model="author.value.value"
						:error-messages="author.errorMessage.value"
						label="Композитор"
						prepend-icon="mdi-account-music"
						@click:clear="author.value.value = ''"
						class="mx-4"
					/>
					<v-text-field
						v-model="variant.value.value"
						:error-messages="variant.errorMessage.value"
						label="Вариант/распев"
						class="mx-4"
						@click:clear="variant.value.value = ''"
					/>
					<v-expansion-panels flat variant="accordion" :class="$style.expansion">
						<v-expansion-panel
							title="Больше информации"
							expand-icon="mdi-plus"
							collapse-icon="mdi-minus"
						>
							<v-expansion-panel-text>
								<v-text-field
									label="Аранжировщик"
									v-model="arranger.value.value"
									:error-messages="arranger.errorMessage.value"
									@click:clear="arranger.value.value = ''"
								/>
								<v-text-field
									label="Наборщик"
									v-model="typesetter.value.value"
									:error-messages="typesetter.errorMessage.value"
									@click:clear="typesetter.value.value = ''"
								/>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-sheet>

				<v-sheet border rounded class="pt-5 pb-2">
					<div iv :class="$style.row" class="mx-4">
						<v-select
							label="Тональность"
							v-model="tonality.value.value"
							:error-messages="tonality.errorMessage.value"
							:items="tonalityItems"
							prepend-icon="mdi-music-clef-treble"
							@click:clear="tonality.value.value = undefined"
						/>
						<v-btn-toggle style="margin-top: 2px" v-model="key.value.value">
							<v-btn value="Dur">Мажор</v-btn>
							<v-btn value="Moll">Минор</v-btn>
						</v-btn-toggle>
					</div>
					<div :class="$style.row" class="mx-4">
						<v-select
							label="Состав хора"
							:items="choirItems"
							v-model="choir.value.value"
							:error-messages="choir.errorMessage.value"
							@click:clear="choir.value.value = undefined"
						/>
						<v-text-field
							v-model="voices"
							:error-messages="voicesField.errorMessage.value"
							prepend-icon="mdi-minus"
							append-icon="mdi-plus"
							label="Голоса"
							clearable
							:class="$style.voices"
							@click:clear="voices = undefined"
							@click:prepend="decrement"
							@click:append="increment"
						/>
					</div>
					<v-expansion-panels flat variant="accordion" :class="$style.expansion">
						<v-expansion-panel
							title="Больше информации"
							expand-icon="mdi-plus"
							collapse-icon="mdi-minus"
						>
							<v-expansion-panel-text>
								<v-select
									:items="soloistItems"
									v-model="soloist.value.value"
									:error-messages="soloist.errorMessage.value"
									label="Солист"
									@click:clear="soloist.value.value = undefined"
								/>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-sheet>

				<v-sheet border rounded class="pt-5 pb-2 px-4">
					<v-text-field
						label="Праздник"
						v-model="holiday.value.value"
						:error-messages="holiday.errorMessage.value"
						@click:clear="holiday.value.value = ''"
						prepend-icon="mdi-cross"
					/>
					<v-select
						label="Служба"
						:items="serviceItems"
						v-model="service.value.value"
						:error-messages="service.errorMessage.value"
						@click:clear="service.value.value = undefined"
					/>
				</v-sheet>

				<v-sheet border rounded class="pt-2 pb-2">
					<v-expansion-panels flat variant="accordion" :class="$style.expansion">
						<v-expansion-panel
							title="Дополнительная информация"
							expand-icon="mdi-plus"
							collapse-icon="mdi-minus"
						>
							<v-expansion-panel-text>
								<v-select
									:items="languageItems"
									v-model="language.value.value"
									:error-messages="language.errorMessage.value"
									label="Язык"
									prepend-icon="mdi-translate-variant"
									@click:clear="language.value.value = undefined"
								/>
								<v-select
									:items="languageItems"
									v-model="translit.value.value"
									:error-messages="translit.errorMessage.value"
									label="Транслитерация"
									@click:clear="translit.value.value = undefined"
								/>

								<v-text-field
									label="Сокращение"
									v-model="alias.value.value"
									:error-messages="alias.errorMessage.value"
									@click:clear="alias.value.value = ''"
								/>
								<v-text-field
									label="Сборник"
									v-model="book.value.value"
									:error-messages="book.errorMessage.value"
									@click:clear="book.value.value = ''"
								/>
								<v-text-field
									label="Год написания"
									v-model="writtenIn"
									:error-messages="writtenInField.errorMessage.value"
									@click:clear="writtenIn = undefined"
								/>
								<v-textarea
									label="Текст"
									v-model="text.value.value"
									:error-messages="text.errorMessage.value"
									@click:clear="text.value.value = ''"
								/>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-sheet>

				<v-btn type="submit" class="w-100" size="large" color="primary">Загрузить</v-btn>
			</v-form>
		</v-sheet>
	</v-container>
	<v-alert
		v-model="showAlert"
		:class="$style.alert"
		closable
		:type="alertType"
		:text="alertText"
		position="fixed"
		location="bottom"
	/>
</template>
<style module>
.canvas {
	width: 100%;
	height: 100%;
	background: url('./pdf_placeholder.svg') center/50% no-repeat;
	display: block;
}

.sheet {
	max-width: 50vh;
	width: 100%;
	height: auto;
	aspect-ratio: 1190 / 1683;
	margin-bottom: 20px;
	overflow: hidden;
}

.expansion :global(.v-expansion-panel-text__wrapper) {
	padding-left: 16px;
	padding-right: 16px;
	padding-bottom: 0;
}

.row {
	display: flex;
	gap: 16px;
}

.voices {
	max-width: 196px;
}
</style>
