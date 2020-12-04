<template>
	<div id="app">
		<Sidebar />
		<notifications group="noti" position="bottom left" />
		<keep-alive exclude="chart,datasource">
			<router-view :key="$route.fullPath" style="margin-left:100px" />
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
	},
};
</script>
