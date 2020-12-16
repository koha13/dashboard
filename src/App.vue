<template>
	<div id="app">
		<div style="width:100vw; height:35px;background:white" v-if="mgl === '0px'">
			<button class="ui icon button" style="background:transparent">
				<i class="bars icon" @click="toggleSidebar"></i>
			</button>
		</div>
		<Sidebar />
		<notifications group="noti" position="bottom left" />
		<div :style="{ 'margin-left': mgl, 'margin-right': '5px' }">
			<keep-alive exclude="chart,datasource,ActiveMQ,Redis">
				<router-view :key="$route.fullPath" />
			</keep-alive>
		</div>
	</div>
</template>
<script>
import Sidebar from "@/components/Sidebar";
$(document).ready(function() {
	if ($(window).width() < 600) {
		$("#sidebar").removeClass("visible");
	}
});
export default {
	components: {
		Sidebar,
	},
	created() {
		this.$store.commit("deleteData");
		if ($(window).width() < 600) {
			this.$store.commit("fixLayout");
			this.mgl = "0px";
		}
	},
	data() {
		return {
			mgl: "90px",
		};
	},
	methods: {
		toggleSidebar() {
			$("#sidebar").sidebar("show");
		},
	},
};
</script>
