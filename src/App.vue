<script setup lang="ts">
import Camera from "@/components/Camera.vue"
import Row from "@/components/Row.vue"
import { ref } from "vue"
import { DataRow, LineItem, Roommate } from "@/types"

const PROXY_URL = "https://50.92.11.93"

const showCamera = ref(false)
const photoTaken = ref(false)
const isLoading = ref(false)
const loadingText = ref("Loading...")
const dataRows = ref<DataRow[]>([])
const treatNegativeAsDiscount = ref(true)

function scan() {
	showCamera.value = true
}

function processResult(veryfiApiJsonResult: any): DataRow[] {
	const items: LineItem[] = veryfiApiJsonResult.line_items
	const rows: DataRow[] = items.map(item => ({
		description: item.description,
		total: item.total,
		active: true,
		paidShares: { damian: 0, finn: 0, isaac: 0, will: 0, wyatt: 0 },
		owedShares: { damian: 0, finn: 0, isaac: 0, will: 0, wyatt: 0 },
	}))

	if (treatNegativeAsDiscount.value) {
		for (let i = 0; i < rows.length; i++) {
			while (i + 1 < rows.length && rows[i + 1].total < 0) {
				// Subtract the discount and round to 2 decimal places
				rows[i].total = Math.round((rows[i].total + rows[i + 1].total) * 100) / 100
				console.log(`Interpreting '${rows[i + 1].description}' as a discount for '${rows[i].description}'`) // Leave this here
				rows.splice(i + 1, 1)
			}
		}
	}

	return rows
}

async function processPhoto(data: string) {
	photoTaken.value = true
	showCamera.value = false

	// Veryfi API through express proxy
	const options = {
		method: "POST",
		body: JSON.stringify({
			data: data,
		}),
		headers: {
			"Content-Type": "application/json",
			apikey: import.meta.env.VITE_MY_APIKEY,
			Accept: "application/json",
		},
	}

	// Make request and show loading text while the request is processing
	isLoading.value = true
	const response = await fetch(PROXY_URL + "/veryfi_api", options)
	const result = await response.json()

	// If request failed, output the error message
	if (!response.ok) {
		console.error(result)
		loadingText.value = `Proxy server returned an error: ${JSON.stringify(result)}`
		return
	}

	isLoading.value = false

	dataRows.value = processResult(result)
}

function handleActiveChange(e: any, index: number) {
	dataRows.value[index].active = e.target.checked
}

function handleDescriptionChange(e: any, index: number) {
	console.log(`Renaming '${dataRows.value[index].description}' to '${e.target.value}'`) // Leave this here
	dataRows.value[index].description = e.target.value
}

function handleTotalChange(e: any, index: number) {
	console.log(`Changing $${dataRows.value[index].total} to $${e.target.value}`) // Leave this here
	dataRows.value[index].total = e.target.value
}

function handlePaidSharesChange(e: any, who: Roommate, index: number) {
	dataRows.value[index].paidShares[who] = e.target.value
	console.log(dataRows.value)
}

function handleOwedSharesChange(e: any, who: Roommate, index: number) {
	dataRows.value[index].owedShares[who] = e.target.value
}

function handleAddNewEntry() {
	dataRows.value.push({
		description: "New entry",
		total: 0,
		active: true,
		paidShares: { damian: 0, finn: 0, isaac: 0, will: 0, wyatt: 0 },
		owedShares: { damian: 0, finn: 0, isaac: 0, will: 0, wyatt: 0 },
	})
	console.log("Adding new entry")
}

async function handleSave() {
	const activeRows = dataRows.value.filter(row => row.active)
	const processedRows = activeRows.map(row => [
		row.description,
		row.total,
		row.paidShares.damian,
		row.paidShares.finn,
		row.paidShares.isaac,
		row.paidShares.will,
		row.paidShares.wyatt,
		"",
		row.owedShares.damian,
		row.owedShares.finn,
		row.owedShares.isaac,
		row.owedShares.will,
		row.owedShares.wyatt,
		"",
	])

	const options = {
		method: "POST",
		body: JSON.stringify(processedRows),
		headers: {
			"Content-Type": "application/json",
			apikey: import.meta.env.VITE_MY_APIKEY,
			Accept: "application/json",
		},
	}

	const response = await fetch(PROXY_URL + "/upload_to_spreadsheet", options)
	const result = await response.json()

	console.log(result)
}
</script>

<template>
	<div id="container">
		<template v-if="!photoTaken">
			<div id="negative-discount">
				<label for="treat-negative-as-discount">Treat negative values as discounts?</label>
				<input type="checkbox" id="treat-negative-as-discount" v-model="treatNegativeAsDiscount" />
			</div>
			<button v-if="!showCamera" @click="scan">Scan receipt</button>
			<Camera v-else @photo-taken="processPhoto" />
		</template>
		<span v-if="isLoading">{{ loadingText }}</span>
		<Row
			v-for="(dataRow, index) in dataRows"
			:dataRow="dataRow"
			:index="index"
			:key="index"
			@active-change="handleActiveChange"
			@description-change="handleDescriptionChange"
			@total-change="handleTotalChange"
			@paid-shares-change="handlePaidSharesChange"
			@owed-shares-change="handleOwedSharesChange"
		/>
		<template v-if="photoTaken && !isLoading">
			<button @click="handleAddNewEntry">Add new entry</button>
			<button @click="handleSave">Save to spreadsheet</button>
		</template>
	</div>
</template>

<style scoped lang="scss">
#container {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	button {
		max-width: 60vw;
	}
}

#negative-discount {
	display: flex;
	flex-direction: row;
	text-align: center;
	align-items: center;

	* {
		padding: 8px;
	}
}

input[type="checkbox"] {
	width: min(3vw, 3vh);
	height: min(3vw, 3vh);
	padding: 2px;
}
</style>
