<template>
	<div id="app" style="margin-top:20px">
		<notifications group="noti" position="bottom left" />
		<!-- <div id="nav">
			<router-link to="/">Home</router-link> | <router-link to="/create">Create</router-link> |
			<router-link to="/datasource">Create Datasource</router-link>
		</div> -->
		<keep-alive>
			<router-view :key="$route.fullPath" exculde="/create" />
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
