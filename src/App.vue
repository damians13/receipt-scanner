<script setup lang="ts">
import Camera from "@/components/Camera.vue"
import { ref } from "vue"

// const OCR_API_URL = "https://api.ocr.space/parse/image"
// const VERYFI_API_URL = "https://api.veryfi.com/api/v8/partner/documents"
const PROXY_URL = "https://localhost/veryfi_api"

const showCamera = ref(false)
const photoTaken = ref(false)
const isLoading = ref(false)
const loadingText = ref("Loading...")
const _data = ref("") // debug

function scan() {
	showCamera.value = true
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
	const response = await fetch(PROXY_URL, options)
	const result = await response.json()

	// If request failed, output the error message
	if (!response.ok) {
		console.error(result)
		loadingText.value = `Proxy server returned an error: ${JSON.stringify(result)}`
		return
	}

	isLoading.value = false

	_data.value = JSON.stringify(result) // debug
}
</script>

<template>
	<div id="container">
		<button v-if="!showCamera && !photoTaken" @click="scan">Scan receipt</button>
		<Camera v-else-if="showCamera && !photoTaken" @photo-taken="processPhoto" />
		<span v-if="isLoading">{{ loadingText }}</span>
	</div>
	<p>{{ _data }}</p>
</template>

<style scoped lang="scss"></style>
