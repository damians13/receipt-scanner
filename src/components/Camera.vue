<script setup lang="ts">
import { onMounted, ref } from "vue"

const video = ref<HTMLVideoElement>()
const canvas = ref<HTMLCanvasElement>()
const photo = ref<HTMLImageElement>()
const deniedPermission = ref(false)
const streaming = ref(true)

const videoWidth = ref(640)
const videoHeight = ref(480)

let stream: MediaStream

// Camera options
const facingMode = "environment"
const constraints = {
	audio: false,
	video: {
		facingMode: facingMode,
	},
}

async function getVideoFeed() {
	// Stream the camera feed to the video element
	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints)
		deniedPermission.value = false

		if (video.value) {
			video.value.setAttribute("playsinline", "")
			video.value.setAttribute("autoplay", "")
			video.value.setAttribute("muted", "")
			video.value.srcObject = stream
		}
	} catch (e) {
		if (e instanceof DOMException) {
			deniedPermission.value = true
		} else {
			console.error(e)
		}
	}
}

async function takePhoto() {
	streaming.value = false

	if (canvas.value && video.value) {
		const context = canvas.value.getContext("2d")

		// Resize the canvas to match the video
		videoWidth.value = video.value.videoWidth
		videoHeight.value = video.value.videoHeight
		canvas.value.width = videoWidth.value
		canvas.value.height = videoHeight.value

		// Draw the image from the video feed on the canvas
		context?.drawImage(video.value, 0, 0, videoWidth.value, videoHeight.value)

		const data = canvas.value.toDataURL("image/png")
		photo.value?.setAttribute("src", data)
	}

	stream.getTracks()[0].stop() // Stop the camera stream
}

onMounted(async () => {
	await getVideoFeed()
})
</script>

<template>
	<div v-if="deniedPermission">
		<p>Camera access is necessary to scan receipts.</p>
	</div>
	<div id="content" v-else>
		<div id="display">
			<video @change="getVideoFeed" ref="video" />
			<img src="" ref="photo" />
		</div>
		<button v-if="streaming" @click="takePhoto">Take photo</button>
		<canvas ref="canvas" />
	</div>
</template>

<style scoped>
div#content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

div#display {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-width: v-bind(videoWidth + "px");
	min-height: v-bind(videoHeight + "px");
}

video,
img {
	position: absolute;
	max-width: 80vw;
	max-height: 80vh;
	min-width: 40vw;
	min-height: 40vh;
}

canvas {
	display: none;
}
</style>
