<template>
	<div>
		{{ layout }}
		<br /><br />
		{{ layoutFromStore }}
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
				v-for="item in layout"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				:key="item.i"
			>
				<!--@resize="resizeEvent"-->
				<!--@move="moveEvent"-->
				<!--@resized="resizedEvent"-->
				<!--@moved="movedEvent"-->
				<span class="text">{{ item.i }}</span>
			</grid-item>
		</grid-layout>
	</div>
</template>

<script>
import * as VueGridLayout from "vue-grid-layout";

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
export default {
	data() {
		return {
			layout: [],
		};
	},
	created() {
		this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
	},
	components: {
		GridLayout: GridLayout,
		GridItem: GridItem,
	},
	// watch: {
	// 	layoutFromStore(val) {
	// 		if (val) {
	// 			this.layout = JSON.parse(JSON.stringify(this.layoutFromStore));
	// 		}
	// 	},
	// },
	computed: {
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

			this.$store.commit("getBoards", filtered);
		},
	},
};
</script>
