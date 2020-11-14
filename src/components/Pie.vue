<template>
	<div class="highcharts-figure">
		<div :id="board.name"></div>
		<button class="ui button negative" @click="deleteChart">Delete</button>
	</div>
</template>

<script>
import * as Highcharts from "highcharts";
export default {
	props: {
		board: Object,
	},
	data() {
		return {
			interval: null,
		};
	},
	mounted() {
		this.$store.dispatch("updateBoard", this.board.name).then((res) => {
			this.graph();
			this.interval = setInterval(async () => {
				await this.$store.dispatch("updateBoard", this.board.name);
				if (this.$route.name === "Home") this.graph();
			}, this.board.intervalTime);
		});
	},
	destroyed() {
		clearInterval(this.interval);
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.name);
		},
		graph() {
			Highcharts.setOptions({
				plotOptions: {
					series: {
						animation: false,
					},
				},
			});
			Highcharts.chart({
				chart: {
					renderTo: this.board.name,
					type: "pie",
					animation: false,
				},
				title: {
					text: this.board.name,
				},
				tooltip: {
					pointFormat: "<b>{point.percentage:.1f}%</b>",
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

<style>
.highcharts-figure,
.highcharts-data-table table {
	min-width: 320px;
	max-width: 660px;
	margin: 1em auto;
}

.highcharts-data-table table {
	font-family: Verdana, sans-serif;
	border-collapse: collapse;
	border: 1px solid #ebebeb;
	margin: 10px auto;
	text-align: center;
	width: 100%;
	max-width: 500px;
}
.highcharts-data-table caption {
	padding: 1em 0;
	font-size: 1.2em;
	color: #555;
}
.highcharts-data-table th {
	font-weight: 600;
	padding: 0.5em;
}
.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
	padding: 0.5em;
}
.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
	background: #f8f8f8;
}
.highcharts-data-table tr:hover {
	background: #f1f7ff;
}
</style>
