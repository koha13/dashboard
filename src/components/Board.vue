<template>
	<div class="highcharts-figure">
		<component :is="boardType" :board="board" class="no-drag"></component>
		<button class="ui button tiny negative" @click="deleteChart">Delete</button>
		<div class="vue-draggable-handle"></div>
		<div class="ui message" v-if="log !== ''">
			<p>
				{{ log }}
			</p>
		</div>
	</div>
</template>

<script>
import Pie from "./Pie.vue";
import Line from "./LineChart.vue";
import Table from "./Table.vue";
export default {
	props: {
		board: Object,
	},
	components: {
		Pie,
		Line,
		Table,
	},
	data() {
		return {
			boardType: "Pie",
			log: "",
		};
	},
	created() {
		this.boardType = this.board.type;
		console.log(this.boardType);
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.name);
			this.$emit("update");
		},
	},
};
</script>

<style></style>
