<template>
	<div>
		<div class="ui centered grid">
			<div class="row">
				<button class="ui tiny button primary" @click="$router.push({ name: 'Chart' })">
					New board
				</button>
				<button class="ui tiny button" @click="showDS = !showDS">
					{{ showDS ? "Hide Datasource" : "Show Datasrouce" }}
				</button>
				<button class="ui tiny button" @click="$router.push({ name: 'Datasource' })">
					Add Datasource
				</button>
			</div>
			<div class="five wide column" v-show="showDS">
				<table class="ui celled small table">
					<thead>
						<tr>
							<th>Datasource Name</th>
							<th>option</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="f in datasources" :key="f.name">
							<td data-label="Field name">{{ f.datasourceName }}</td>
							<td class="collapsing">
								<button
									class="ui mini button negative"
									@click.prevent="$store.commit('deleteDatasource', f.datasourceName)"
								>
									Delete
								</button>
								<button class="ui mini button primary" @click.prevent="updateDS(f.datasourceName)">
									Option
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="row" style="margin-top:30px">
			<grid-layout
				@layout-updated="layoutUpdatedEvent"
				:layout="layout"
				:col-num="12"
				:row-height="30"
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
					:key="item.name"
					drag-allow-from=".vue-draggable-handle"
					drag-ignore-from=".no-drag"
				>
					<Pie v-if="item.type == 'Pie'" :board="item" @update="updateLayout" />
					<LineChart v-if="item.type == 'Line'" :board="item" @update="updateLayout" />
					<Table v-if="item.type == 'Table'" :board="item" @update="updateLayout" />
				</grid-item>
			</grid-layout>
			<!-- <div v-for="b in boards" :key="b.i" class="eight wide column">
				<Pie v-if="b.type == 'Pie'" :board="b" />
				<LineChart v-if="b.type == 'Line'" :board="b" />
			</div> -->
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
			showDS: false,
		};
	},
	activated() {
		if (this.layoutFromStore !== this.layout) {
			this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
		}
	},
	computed: {
		boards: {
			get() {
				return this.$store.state.boards;
			},
		},
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
		updateDS(name) {
			this.$router.push({ name: "Datasource", query: { name } });
		},
	},
};
</script>
<style scoped>
.gridItem {
	border: solid 1px black;
}
</style>
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
.vue-draggable-handle {
	position: absolute;
	width: 20px;
	height: 20px;
	top: 0;
	right: 0;
	padding: 0 8px 8px 0;
	background-origin: content-box;
	background-color: black;
	box-sizing: border-box;
	border-radius: 10px;
	cursor: pointer;
}
</style>
