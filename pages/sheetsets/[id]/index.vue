<script setup lang="ts">
import { formatDate } from '~/utils/formatDate';

const route = useRoute();
const router = useRouter();
const { $client } = useNuxtApp();
const toasts = useToasts();

const id = computed(() => Number(route.params.id));

const sheetset = await $client.sheetsets.get.query(id.value);

const openPdf = (filePath: string) => {
	window.open(filePath, '__blank');
};

const deleteSheetset = async () => {
	try {
		const { title } = await $client.sheetsets.delete.mutate(id.value);
		toasts.push({
			type: 'success',
			title: 'Набор успешно удален',
			text: title,
		});
		router.push('/sheetsets');
	} catch (err) {
		toasts.push({
			type: 'error',
			title: getErrorMessage(err),
		});
	}
};

const downloadZip = () => {
	window.open(`/sheetsets/${id.value}/zip`, '__blank');
};
</script>
<template>
	<v-container>
		<header>
			<h2 class="text-h2">{{ sheetset.title }}</h2>
			<v-breadcrumbs>
				<v-breadcrumbs-item> <router-link to="/">Главная</router-link> </v-breadcrumbs-item>/
				<v-breadcrumbs-item>
					<router-link to="/sheetsets"> Наборы </router-link> </v-breadcrumbs-item
				>/
				<v-breadcrumbs-item>
					<router-link :to="`/sheetsets/${sheetset.id}`">{{ sheetset.title }}</router-link>
				</v-breadcrumbs-item>
			</v-breadcrumbs>
		</header>

		<p class="text-subtitle-2 text-medium-emphasis mb-4">
			{{ sheetset.date && formatDate(sheetset.date) }}
		</p>
		<p class="text-body-1 mb-8">{{ sheetset.description }}</p>
		<v-sheet rounded border class="mb-8">
			<v-list rounded>
				<v-list-item
					v-for="({ id, title, author, variant, filePath }, index) of sheetset.sheets"
					:key="id"
					:title="`${index + 1}. ${title}`"
					:subtitle="author ?? variant ?? ''"
				>
					<template #append>
						<v-btn icon="mdi-open-in-new" variant="text" @click="openPdf(filePath)"></v-btn>
					</template>
				</v-list-item>
			</v-list>
		</v-sheet>
		<v-btn color="primary" class="w-100 mb-4" @click="downloadZip" prepend-icon="mdi-zip-box"
			>Скачать архив</v-btn
		>
		<v-btn color="error" class="w-100" @click="deleteSheetset" variant="tonal">Удалить набор</v-btn>
	</v-container>
</template>
<style module></style>
