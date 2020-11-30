<template>
	<div class="highcharts-figure">
		<div :id="board.name" class="no-drag"></div>
		<!-- <button class="ui button tiny negative" @click="deleteChart">Delete</button> -->
		<div class="vue-draggable-handle">
			<i class="arrows alternate icon"></i>
		</div>
		<div class="close-handle" @click="deleteChart">
			<i class="window close outline icon"></i>
		</div>
		<div class="config-handle">
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
		this.$store.dispatch("updateBoard", this.board.name).then((res) => {
			this.log = res;
			this.graph();
			bus.$on("reflow", () => {
				this.chart.reflow();
			});
			this.interval = setInterval(async () => {
				this.log = await this.$store.dispatch("updateBoard", this.board.name);
				if (this.$route.name === "Home") {
					this.chart.update({
						series: this.board.data,
					});
				}
			}, this.board.intervalTime);
		});
	},
	destroyed() {
		clearInterval(this.interval);
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.name);
			this.$emit("update");
		},
		graph() {
			this.chart = Highcharts.chart(this.board.name, {
				title: {
					text: this.board.name,
				},
				chart: {
					animation: false,
				},
				xAxis: {
					labels: {
						enabled: false,
					},
				},
				legend: {
					layout: "vertical",
					align: "right",
					verticalAlign: "middle",
				},

				series: this.board.data,

				responsive: {
					rules: [
						{
							condition: {
								maxWidth: 500,
							},
							chartOptions: {
								legend: {
									layout: "horizontal",
									align: "center",
									verticalAlign: "bottom",
								},
							},
						},
					],
				},
			});
		},
	},
};
</script>
