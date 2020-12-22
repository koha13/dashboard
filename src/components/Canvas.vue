<template>
	<div @keyup.esc="exitCanvas" @keyup.ctrl.90.exact="undo">
		<Editor
			:canvasWidth="windowW"
			:canvasHeight="windowH"
			ref="editor"
			editorId="canvasId"
			:class="{ unfocus: !focusCanvas }"
			style="position: absolute;top:0;width:700px; height:700px;z-index:100"
		/>
		<button
			:class="[
				'ui',
				'labeled',
				'icon',
				'mini',
				{ blue: !focusCanvas },
				{ red: focusCanvas },
				'button',
			]"
			style="position:absolute;bottom:10px;right:0;z-index:1000"
			@click="toggleDrawMode"
		>
			<i class="left chevron icon"></i>
			{{ focusCanvas ? "Exit" : "Draw" }}
		</button>
		<div
			class="ui vertical icon buttons control-draw"
			style="position:absolute;bottom:50px;right:0;z-index:1000"
			v-if="focusCanvas"
		>
			<!-- Mode controller -->
			<button
				title="Free drawing"
				:class="['ui', 'button', { active: drawMode == 'freeDrawing' }]"
				@click="changeDrawMode('freeDrawing')"
			>
				<i class="pencil alternate icon"></i>
			</button>
			<button
				title="Arrow"
				:class="['ui', 'button', { active: drawMode == 'arrow' }]"
				@click="changeDrawMode('arrow')"
			>
				<i class="long arrow alternate down icon"></i>
			</button>
			<button
				title="Select Mode"
				:class="['ui', 'button', { active: drawMode == 'selectMode' }]"
				@click="changeDrawMode('selectMode')"
			>
				<i class="arrows alternate icon"></i>
			</button>
			<button title="Undo" :class="['ui', 'button']" @click="undo">
				<i class="undo icon"></i>
			</button>
			<button title="Redo" :class="['ui', 'button']" @click="redo">
				<i class="redo icon"></i>
			</button>
			<button
				title="Eraser"
				:class="['ui', 'button', { active: drawMode == 'eraser' }]"
				@click="changeDrawMode('eraser')"
			>
				<i class="eraser icon"></i>
			</button>
			<button title="Clear all" class="ui button" @click="() => this.$refs.editor.clear()">
				<i class="trash icon"></i>
			</button>
		</div>
		<!-- Color controller -->
		<div
			class="ui vertical icon buttons control-color"
			style="position:absolute;bottom:50px;right:50px;z-index:1000"
			v-if="focusCanvas"
		>
			<button :class="['ui', 'button', 'black']" @click="changeColor('black')">
				<i class="pencil alternate icon" v-if="color == 'black'"></i>
			</button>
			<button :class="['ui', 'button', 'red']" @click="changeColor('red')">
				<i class="pencil alternate icon" v-if="color == 'red'"></i>
			</button>
			<button :class="['ui', 'button', 'green']" @click="changeColor('green')">
				<i class="pencil alternate icon" v-if="color == 'green'"></i>
			</button>
			<button :class="['ui', 'button', 'blue']" @click="changeColor('blue')">
				<i class="pencil alternate icon" v-if="color == 'blue'"></i>
			</button>
		</div>
	</div>
</template>

<script>
import Editor from "vue-image-markup";
export default {
	components: {
		Editor,
	},
	created() {
		this.windowW = $(window).width();
		this.windowH = $(window).height();
	},
	data() {
		return {
			windowH: 100,
			windowW: 100,
			focusCanvas: false,
			drawMode: "freeDrawing",
			color: "black",
		};
	},
	mounted() {
		this.$refs.editor.set(this.drawMode);
		this.$refs.editor.canvas.backgroundColor = "transparent";
		this.$refs.editor.canvas.contextContainer.clearRect(0, 0, this.windowW, this.windowH);
	},
	methods: {
		exitCanvas() {
			console.log("here");
			if (this.focusCanvas) this.focusCanvas = false;
		},
		toggleDrawMode() {
			this.focusCanvas = !this.focusCanvas;
		},
		changeDrawMode(mode) {
			this.drawMode = mode;
			this.$refs.editor.set(this.drawMode);
		},
		changeColor(color) {
			this.color = color;
			this.$refs.editor.set(this.drawMode, { stroke: this.color });
		},
		undo() {
			this.$refs.editor.undo();
			this.$refs.editor.set(this.drawMode);
		},
		redo() {
			this.$refs.editor.redo();
			this.$refs.editor.set(this.drawMode);
		},
	},
};
</script>

<style scoped>
.unfocus {
	pointer-events: none;
}
</style>
