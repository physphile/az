<script setup lang="ts">
import type { Service } from '@prisma/client';
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import VueDraggable from 'vuedraggable';
import { createSheetsetSchema } from '~/schemas/createSheetsetSchema';
import { serviceItems } from '../../constants';
import { dateToIso } from '~/utils/dateToIso';
import { getErrorMessage } from '~/utils/getErrorMessage';

const sheetset = useSheetset();
const toasts = useToasts();
const { $client } = useNuxtApp();
const router = useRouter();

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(
		createSheetsetSchema.omit({
			sheetIds: true,
		})
	),
	initialValues: {
		date: undefined,
		description: '',
		service: undefined,
		title: '',
	},
});

const title = useField<string>('title');
const description = useField<string>('description');
const service = useField<Service | undefined>('service');
const dateField = useField<string | undefined>('date');
const date = computed({
	get() {
		return dateField.value.value ? new Date(dateField.value.value) : undefined;
	},
	set(date: Date | undefined) {
		dateField.value.value = date ? dateToIso(date) : undefined;
	},
});

const openPdf = (filePath: string) => {
	window.open(filePath, '__blank');
};

const submitHandler = handleSubmit(async values => {
	try {
		const { id } = await $client.sheetsets.create.mutate({
			sheetIds: sheetset.sheets.map(s => s.id),
			title: values.title,
			date: values.date,
			description: values.description || undefined,
			service: values.service,
		});
		toasts.push({
			type: 'success',
			title: 'Набор успешно сохранен',
			text: values.title,
		});
		await router.push(`/sheetsets/${id}`);
		sheetset.clear();
	} catch (err) {
		toasts.push({
			type: 'error',
			title: getErrorMessage(err),
		});
	}
});

const downloadZip = () => {
	const searchParams = new URLSearchParams();
	searchParams.append('title', title.value.value);
	console.log(sheetset.sheets.map(s => s.title));
	sheetset.sheets.forEach(s => searchParams.append('id', s.id.toString()));
	window.open(`/sheets/sheetset/zip?${searchParams.toString()}`, '__blank');
};
</script>
<template>
	<v-container :class="$style.container">
		<template v-if="sheetset.length">
			<h1 class="text-h4">Набор</h1>
			<v-sheet rounded border class="py-3">
				<vue-draggable v-model="sheetset.sheets" item-key="id" handle=".handle">
					<template #item="{ element, index }">
						<v-list-item
							:title="`${index + 1}. ${element.title}`"
							:subtitle="element.author ?? element.variant"
							:class="$style.item"
						>
							<template #prepend>
								<v-btn
									icon="mdi-notebook-remove"
									variant="text"
									@click="sheetset.remove(element.id)"
									class="mr-4"
								></v-btn>
							</template>
							<template #append>
								<v-btn
									icon="mdi-open-in-new"
									variant="text"
									@click="openPdf(element.filePath)"
								></v-btn>
								<v-btn
									icon="mdi-drag-horizontal-variant"
									class="handle"
									:class="$style.handle"
									variant="text"
								>
								</v-btn>
							</template>
						</v-list-item>
					</template>
				</vue-draggable>
			</v-sheet>
			<v-form :class="$style.container" @submit.prevent="submitHandler">
				<v-sheet rounded border class="overflow-hidden pt-5 pb-2">
					<v-text-field
						v-model="title.value.value"
						:error-messages="title.errorMessage.value"
						label="Название*"
						prepend-icon="mdi-alpha"
						@click:clear="title.value.value = ''"
						class="mx-4"
					>
					</v-text-field>
					<v-expansion-panels flat variant="accordion" :class="$style.expansion">
						<v-expansion-panel
							title="Сохранить набор"
							expand-icon="mdi-plus"
							collapse-icon="mdi-minus"
						>
							<v-expansion-panel-text>
								<div :class="$style.row">
									<v-select
										:items="serviceItems"
										v-model="service.value.value"
										:error-messages="service.errorMessage.value"
										label="Служба"
										@click:clear="service.value.value = undefined"
									></v-select>
									<v-menu :close-on-content-click="false">
										<template #activator="{ props }">
											<v-text-field
												v-bind="props"
												v-model="dateField.value.value"
												:error-messages="dateField.errorMessage.value"
												label="Дата"
												style="max-width: 328px"
												@click:clear="dateField.value.value = undefined"
											>
											</v-text-field>
										</template>
										<v-date-picker v-model="date" />
									</v-menu>
								</div>
								<v-textarea
									v-model="description.value.value"
									:error-messages="description.errorMessage.value"
									label="Описание"
									@click:clear="description.value.value = ''"
								>
								</v-textarea>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-sheet>
				<v-btn type="submit" color="primary" class="w-100">Сохранить</v-btn>
				<v-btn prepend-icon="mdi-zip-box" variant="tonal" color="secondary" @click="downloadZip"
					>Скачать архив</v-btn
				>
			</v-form>
		</template>

		<v-sheet v-else rounded border class="pa-4">
			<v-empty-state
				icon="mdi-notebook-multiple"
				title="Нет партитур"
				text="Вы еще не добавили ни одной партитуры"
			>
				<template #actions>
					<v-btn color="primary" @click="$router.push('/sheets')" append-icon="mdi-open-in-new">
						Выбрать</v-btn
					>
				</template>
			</v-empty-state>
		</v-sheet>
	</v-container>
</template>
<style module>
.item {
	user-select: none;
}

.handle {
	cursor: grab;
}

.container {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.row {
	display: flex;
	gap: 16px;
}
</style>
~/utils/dateToIso
