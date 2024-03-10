<script setup lang="ts">
import { tonalityMap, keyMap, serviceMap } from '../constants';
import { serviceColorMap } from '../constants';

const { $client } = useNuxtApp();
const sheetset = useSheetset();

const query = ref('');
const sheets = ref(await $client.sheets.search.query(query.value));

async function fetchSheets(q: string) {
	sheets.value = await $client.sheets.search.query(q);
}

watch(
	() => query.value,
	async val => {
		await fetchSheets(val);
	}
);
</script>
<template>
	<v-container>
		<h1 class="text-h4 mb-5">Партитуры</h1>
		<v-form class="d-flex">
			<v-text-field
				type="search"
				label="Поиск"
				prepend-inner-icon="mdi-magnify"
				density="comfortable"
				rounded="0"
				v-model="query"
			/>
			<v-btn type="submit" variant="flat" icon="mdi-magnify" rounded="0" color="primary"></v-btn>
		</v-form>
		<div :class="$style.grid">
			<v-card v-for="sheet of sheets" :key="sheet.id">
				<v-img width="100%" height="200" :src="sheet.thumbnailPath" position="top" cover />
				<v-card-title>{{ sheet.title }}</v-card-title>
				<v-card-subtitle>{{ sheet.author ?? sheet.variant ?? '' }}</v-card-subtitle>
				<v-card-text style="min-height: 64px">
					<v-chip v-if="sheet.tonality && sheet.key" class="mr-2">{{
						`${tonalityMap[sheet.tonality]} ${keyMap[sheet.key].toLowerCase()}`
					}}</v-chip>
					<v-chip v-if="sheet.service" :color="serviceColorMap[sheet.service]">{{
						serviceMap[sheet.service]
					}}</v-chip>
				</v-card-text>
				<v-card-actions class="justify-end">
					<v-btn icon="mdi-heart" size="large" color="primary"></v-btn>
					<dev-only>
						<v-btn
							:icon="sheetset.has(sheet.id) ? 'mdi-notebook-minus' : 'mdi-notebook-plus'"
							:active="sheetset.has(sheet.id)"
							size="large"
							color="primary"
							@click="sheetset.has(sheet.id) ? sheetset.remove(sheet.id) : sheetset.push(sheet)"
						></v-btn>
					</dev-only>
				</v-card-actions>
			</v-card>
		</div>
	</v-container>
	<v-btn
		:class="$style.fab"
		icon="mdi-file-upload"
		size="x-large"
		@click="$router.push('/sheets/create')"
	></v-btn>
</template>
<style module>
.grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;

	@media screen and (540px <= width < 960px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media screen and (960px <= width < 1280px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media screen and (width >= 1280px) {
		grid-template-columns: repeat(4, 1fr);
	}
}

.fab {
	position: fixed !important;
	bottom: 72px;
	right: 16px;
}
</style>
