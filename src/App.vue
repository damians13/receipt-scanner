<script setup lang="ts">
import Camera from "@/components/Camera.vue"
import { ref } from "vue"

// const OCR_API_URL = "https://api.ocr.space/parse/image"
const VERYFI_API_URL = "https://api.veryfi.com/api/v8/partner/documents"

const showCamera = ref(false)
const photoTaken = ref(false)
const loading = ref(false)
const _data = ref("")

function scan() {
	showCamera.value = true
}

async function processPhoto(data: string) {
	console.log(data)

	photoTaken.value = true
	showCamera.value = false

	/* OCR Space API
	const bodyFormData = new URLSearchParams([
		["base64Image", data],
		["language", "eng"],
		["scale", "true"],
		["isTable", "true"],
		["filetype", "PNG"],
	])

	const options = {
		method: "POST",
		body: bodyFormData,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			apikey: import.meta.env.VITE_OCR_SPACE_APIKEY,
		},
	}
	*/

	// Veryfi API (50 requests / month)
	const options = {
		method: "POST",
		mode: "no-cors",
		body: JSON.stringify({
			file_data: data,
			file_name: "receipt.png",
		}),
		headers: {
			"Content-Type": "application/json",
			AUTHORIZATION: import.meta.env.VITE_VERYFI_AUTHENTICATION,
			"CLIENT-ID": import.meta.env.VITE_VERYFI_CLIENT_ID,
		},
	}

	loading.value = true
	const response = await fetch(VERYFI_API_URL, options)
	const result = await response.json()
	loading.value = false
	console.log(result)
	_data.value = result
}
</script>

<template>
	<div id="container">
		<button v-if="!showCamera && !photoTaken" @click="scan">Scan receipt</button>
		<Camera v-else-if="showCamera && !photoTaken" @photo-taken="processPhoto" />
		<span v-if="loading">Loading...</span>
	</div>
	<p>{{ _data }}</p>
</template>

<style scoped lang="scss"></style>
