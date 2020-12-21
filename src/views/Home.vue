<template>
	<div>
		<div class="row" style="padding-top:30px;width:100%;">
			<grid-layout
				@layout-updated="layoutUpdatedEvent"
				:layout="layout"
				:row-height="30"
				:col-num="12"
				:is-draggable="true"
				:is-resizable="true"
				:vertical-compact="true"
				:use-css-transforms="true"
			>
				<grid-item
					class="gridItem"
					v-for="item in layout"
					:x="item.x"
					:y="item.y"
					:w="item.w"
					:h="item.h"
					:i="item.i"
					:key="item.i"
					drag-allow-from=".vue-draggable-handle"
					drag-ignore-from=".no-drag"
				>
					<Pie v-if="item.type == 'Pie'" :board="item" @update="updateLayout" />
					<LineChart v-if="item.type == 'Line'" :board="item" @update="updateLayout" />
					<Table v-if="item.type == 'Table'" :board="item" @update="updateLayout" />
				</grid-item>
			</grid-layout>
		</div>
	</div>
</template>
// drag-allow-from=".vue-draggable-handle" drag-ignore-from=".no-drag"

<script>
import { bus } from "@/main.js";
import Pie from "@/components/Pie";
import LineChart from "@/components/LineChart";
import Table from "@/components/Table";
import * as VueGridLayout from "vue-grid-layout";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

export default {
	components: {
		Pie,
		LineChart,
		GridLayout,
		GridItem,
		Table,
	},
	created() {
		this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
	},
	data() {
		return {
			layout: [],
			rowHeight: 30,
		};
	},
	activated() {
		if (this.layoutFromStore !== this.layout) {
			this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
		}
	},
	computed: {
		datasources: {
			get() {
				return this.$store.state.datasources;
			},
		},
		layoutFromStore: {
			get() {
				return this.$store.getters["getBoards"];
			},
			set(newLayout) {
				this.$store.commit("vuegrid", newLayout);
			},
		},
	},
	methods: {
		layoutUpdatedEvent: function(newLayout) {
			let filtered;
			filtered = newLayout.map((item) => {
				return {
					x: item.x,
					y: item.y,
					w: item.w,
					h: item.h,
					i: item.i,
					name: item.name,
					intervalTime: item.intervalTime,
					fields: item.fields,
					data: item.data,
					type: item.type,
				};
			});
			this.$store.commit("vuegrid", filtered);
			bus.$emit("reflow");
		},
		updateLayout() {
			if (this.layoutFromStore !== this.layout) {
				this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
			}
		},
	},
};
</script>
<style scoped>
.gridItem {
	background: white;
	border-radius: 3px;
	box-shadow: 3px 3px 10px;
}
</style>
<style>
.highcharts-figure,
.highcharts-data-table table {
	min-width: 100px;
	max-width: 800px;
	min-height: 100px;
	max-height: 600px;
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
.vue-draggable-handle {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 14px;
	right: 20px;
}
.close-handle {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 14px;
	right: 0;
	cursor: pointer;
}
.config-handle {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 14px;
	right: 40px;
	cursor: pointer;
}
.row .vue-grid-item.vue-grid-placeholder {
	background: green;
	border-radius: 3px;
}
.highcharts-figure {
	margin-top: 8px !important;
}
</style>
