<script setup lang="ts">
import { serviceColorMap, serviceMap } from '../constants';

const { $client } = useNuxtApp();
const query = ref('');

const sheetsets = ref(await $client.sheetsets.search.query(query.value));

async function fetchSheetsets(q: string) {
	sheetsets.value = await $client.sheetsets.search.query(q);
}

watch(
	() => query.value,
	async val => await fetchSheetsets(val)
);
</script>
<template>
	<v-container>
		<h1 class="mb-5 text-h4">Наборы</h1>
		<v-form class="d-flex" @submit.prevent>
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
			<v-card
				v-for="{ id, date, service, title } of sheetsets"
				:key="id"
				link
				@click="$router.push(`/sheetsets/${id}`)"
			>
				<v-img height="200" src="./image_placeholder.webp" cover position="top"></v-img>
				<v-card-title>{{ title }}</v-card-title>
				<v-card-text style="min-height: 64px">
					<div style="margin-bottom: 8px">
						<v-chip v-if="service" :color="serviceColorMap[service]">{{
							serviceMap[service]
						}}</v-chip>
					</div>
					{{
						date &&
						new Date(date).toLocaleString('ru-RU', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})
					}}
				</v-card-text>
			</v-card>
		</div>
	</v-container>
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
</style>
