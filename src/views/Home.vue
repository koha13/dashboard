<template>
	<div>
		<div class="ui centered grid">
			<div class="row">
				<p>Datasource</p>
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
			<div class="row" style="padding-top:0; margin-top: 0">
				<button class="ui tiny button" @click="showDS = !showDS">
					{{ showDS ? "hide" : "show" }}
				</button>
				<button class="ui tiny button">Add</button>
			</div>
		</div>
		<div class="row">
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
				>
					<Pie v-if="item.type == 'Pie'" :board="item" @update="updateLayout" />
					<LineChart v-if="item.type == 'Line'" :board="item" @update="updateLayout" />
				</grid-item>
			</grid-layout>
			<!-- <div v-for="b in boards" :key="b.i" class="eight wide column">
				<Pie v-if="b.type == 'Pie'" :board="b" />
				<LineChart v-if="b.type == 'Line'" :board="b" />
			</div> -->
		</div>
	</div>
</template>

<script>
import Pie from "@/components/Pie";
import LineChart from "@/components/LineChart";
import * as VueGridLayout from "vue-grid-layout";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;

export default {
	components: {
		Pie,
		LineChart,
		GridLayout: GridLayout,
		GridItem: GridItem,
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
