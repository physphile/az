<script setup lang="ts">
import { useToasts } from './stores/toast';

const sheetset = useSheetset();
const toasts = useToasts();
</script>
<template>
	<v-app>
		<v-app-bar color="primary">
			<v-app-bar-title @click="$router.push('/sheets')" class="cursor-pointer">
				Андреевский звон
			</v-app-bar-title>
			<template #prepend>
				<v-btn
					icon="mdi-arrow-left"
					@click="$router.back()"
					v-if="!['/sheets', '/sheetsets'].includes($route.path)"
				></v-btn>
			</template>
			<template #append>
				<v-btn
					icon="mdi-notebook-remove"
					class="mr-4"
					@click="sheetset.clear()"
					v-if="$route.path === '/sheets' && sheetset.length"
				>
				</v-btn>
				<v-btn
					prepend-icon="mdi-notebook-multiple"
					variant="text"
					size="large"
					@click="$router.push('/sheets/sheetset')"
					>{{ sheetset.length }}</v-btn
				>
			</template>
		</v-app-bar>
		<v-main>
			<NuxtPage />
		</v-main>
		<v-bottom-navigation bg-color="primary" style="z-index: 999">
			<v-btn
				:active="!$route.path.startsWith('/sheetsets') && $route.path.startsWith('/sheets')"
				@click="$router.push('/sheets')"
			>
				<v-icon icon="mdi-file-music"></v-icon>
				<span>Партитуры</span>
			</v-btn>
			<v-btn :active="$route.path.startsWith('/sheetsets')" @click="$router.push('/sheetsets')">
				<v-icon icon="mdi-notebook-multiple"></v-icon>
				<span>Наборы</span>
			</v-btn>
		</v-bottom-navigation>
	</v-app>
	<div class="toasts">
		<transition-group name="list">
			<v-alert
				v-for="{ id, type, title, text } of toasts.toasts.values()"
				:key="id"
				:type="type"
				:title="title"
				:text="text"
				closable
				@click:close="toasts.remove(id)"
			></v-alert>
		</transition-group>
	</div>
</template>
<style scoped>
.toasts {
	display: flex;
	flex-direction: column;
	gap: 16px;
	padding: 16px;
	position: fixed;
	bottom: 56px;
	left: 50%;
	transform: translateX(-50%);
	right: 0;
	max-width: 500px;
}

.list-enter-active,
.list-leave-active {
	transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: translateY(30px);
}
</style>
