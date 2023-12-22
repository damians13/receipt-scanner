<script setup lang="ts">
import { DataRow, Roommate } from "@/types"

const props = defineProps<{
	dataRow: DataRow
	index: number
}>()

const emit = defineEmits(["descriptionChange", "totalChange", "paidSharesChange", "owedSharesChange", "activeChange"])

function handleActiveChange(event: Event) {
	emit("activeChange", event, props.index)
}

function descriptionChange(event: Event) {
	emit("descriptionChange", event, props.index)
}

function totalChange(event: Event) {
	emit("totalChange", event, props.index)
}

function paidSharesChange(event: Event, who: Roommate) {
	emit("paidSharesChange", event, who, props.index)
}

function owedSharesChange(event: Event, who: Roommate) {
	emit("owedSharesChange", event, who, props.index)
}
</script>

<template>
	<div class="container">
		<div class="data-row">
			<label :for="'is-active-' + props.index">Include</label>
			<input type="checkbox" :checked="props.dataRow.active" @change="handleActiveChange" :id="'is-active-' + props.index" />
			<input type="text" :value="props.dataRow.description" @change="descriptionChange" />
			<span
				>$
				<input type="number" step="0.01" :value="props.dataRow.total" @change="totalChange" />
			</span>
		</div>
		<span>Shares paid</span>
		<div class="shares-data">
			<label for="'paid-shares-damian-' + props.index">Damian</label>
			<input type="number" min="0" :value="props.dataRow.paidShares.damian" :id="'paid-shares-damian-' + props.index" @change="paidSharesChange($event, 'damian')" />

			<label for="'paid-shares-finn-' + props.index">Finn</label>
			<input type="number" min="0" :value="props.dataRow.paidShares.finn" :id="'paid-shares-finn-' + props.index" @change="paidSharesChange($event, 'finn')" />

			<label for="'paid-shares-isaac-' + props.index">Isaac</label>
			<input type="number" min="0" :value="props.dataRow.paidShares.isaac" :id="'paid-shares-isaac-' + props.index" @change="paidSharesChange($event, 'isaac')" />

			<label for="'paid-shares-will-' + props.index">Will</label>
			<input type="number" min="0" :value="props.dataRow.paidShares.will" :id="'paid-shares-will-' + props.index" @change="paidSharesChange($event, 'will')" />

			<label for="'paid-shares-wyatt-' + props.index">Wyatt</label>
			<input type="number" min="0" :value="props.dataRow.paidShares.wyatt" :id="'paid-shares-wyatt-' + props.index" @change="paidSharesChange($event, 'wyatt')" />
		</div>

		<span>Shares owed</span>
		<div class="shares-data">
			<label for="'owed-shares-damian-' + props.index">Damian</label>
			<input type="number" min="0" :value="props.dataRow.owedShares.damian" :id="'owed-shares-damian-' + props.index" @change="owedSharesChange($event, 'damian')" />

			<label for="'owed-shares-finn-' + props.index">Finn</label>
			<input type="number" min="0" :value="props.dataRow.owedShares.finn" :id="'owed-shares-finn-' + props.index" @change="owedSharesChange($event, 'finn')" />

			<label for="'owed-shares-isaac-' + props.index">Isaac</label>
			<input type="number" min="0" :value="props.dataRow.owedShares.isaac" :id="'owed-shares-isaac-' + props.index" @change="owedSharesChange($event, 'isaac')" />

			<label for="'owed-shares-will-' + props.index">Will</label>
			<input type="number" min="0" :value="props.dataRow.owedShares.will" :id="'owed-shares-will-' + props.index" @change="owedSharesChange($event, 'will')" />

			<label for="'owed-shares-wyatt-' + props.index">Wyatt</label>
			<input type="number" min="0" :value="props.dataRow.owedShares.wyatt" :id="'owed-shares-wyatt-' + props.index" @change="owedSharesChange($event, 'wyatt')" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.container {
	background-color: #484848;
	border-radius: 8px;
	margin: 4px;
	width: fit-content;
}

.data-row {
	display: flex;
	flex-direction: row;
	text-align: center;
	align-items: center;

	* {
		padding: 4px 4px 4px 12px;
	}
}

.shares-data {
	display: flex;
	flex-direction: row;

	* {
		margin: 0px 12px 12px 12px;
	}
}

input[type="checkbox"] {
	width: min(3vw, 3vh);
	height: min(3vw, 3vh);
	padding: 2px;
}

input[type="number"] {
	width: 48px;
}

label {
	user-select: none;
}
</style>
