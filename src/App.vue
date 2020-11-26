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
<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
