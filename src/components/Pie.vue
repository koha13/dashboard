<template>
	<div class="highcharts-figure">
		<div :id="board.i" class="no-drag"></div>
		<div class="vue-draggable-handle">
			<i class="arrows alternate icon"></i>
		</div>
		<div class="close-handle" @click="deleteChart">
			<i class="window close outline icon"></i>
		</div>
		<div class="config-handle" @click="$router.push({ name: 'Chart', query: { id: board.i } })">
			<i class="pencil alternate icon"></i>
		</div>
		<div class="ui message" v-if="log !== ''">
			<p>
				{{ log }}
			</p>
		</div>
	</div>
</template>

<script>
import * as Highcharts from "highcharts";
import { bus } from "@/main.js";
export default {
	props: {
		board: Object,
	},
	data() {
		return {
			interval: null,
			log: "",
			chart: null,
		};
	},
	mounted() {
		this.$store.dispatch("updateBoard", this.board.i).then((res) => {
			this.log = res;
			this.graph();
			bus.$on("reflow", () => {
				this.chart.reflow();
			});
			this.interval = setInterval(async () => {
				this.log = await this.$store.dispatch("updateBoard", this.board.i);
				if (this.$route.name === "Home") {
					this.chart.series[0].setData(this.$store.getters.getBoard(this.board.i).data);
					this.chart.setTitle({ text: this.board.name });
				}
			}, this.board.intervalTime);
		});
	},
	destroyed() {
		clearInterval(this.interval);
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.i);
			this.$emit("update");
		},
		graph() {
			Highcharts.setOptions({
				plotOptions: {
					series: {
						animation: false,
					},
				},
			});
			this.chart = new Highcharts.chart({
				chart: {
					renderTo: this.board.i.toString(),
					type: "pie",
					animation: true,
				},
				title: {
					text: this.board.name,
				},
				tooltip: {
					pointFormat: "<b>{point.y} - {point.percentage:.1f}%</b>",
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: "pointer",
						dataLabels: {
							enabled: false,
						},
						showInLegend: true,
					},
				},
				series: [
					{
						colorByPoint: true,
						data: this.board.data,
					},
				],
			});
		},
	},
};
</script>

<style scoped></style>
