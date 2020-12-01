<template>
	<div id="app" style="margin-top:20px">
		<notifications group="noti" position="bottom left" />
		<keep-alive exclude="chart,datasource">
			<router-view :key="$route.fullPath" />
		</keep-alive>
	</div>
</template>
<script>
export default {
	created() {
		this.$store.commit("deleteData");
	},
};
</script>
