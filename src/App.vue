<template>
	<div id="app">
		<Sidebar />
		<notifications group="noti" position="bottom left" />
		<keep-alive exclude="chart,datasource,ActiveMQ,Redis">
			<router-view :key="$route.fullPath" style="margin-left:90px; margin-right:5px" />
		</keep-alive>
	</div>
</template>
<script>
import Sidebar from "@/components/Sidebar";
export default {
	components: {
		Sidebar,
	},
	created() {
		this.$store.commit("deleteData");
		if ($(window).width() < 600) {
			this.$store.commit("fixLayout");
		}
	},
};
</script>
