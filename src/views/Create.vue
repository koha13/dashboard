<template>
	<div style="margin-top:20px">
		<h2 class="ui header">Create chart</h2>
		<div class="ui ten doubling cards">
			<div class="ui centered card" @click="$router.push({ name: 'Chart' })">
				<div class="image">
					<img
						src="https://icons.iconarchive.com/icons/icons8/ios7/512/User-Interface-Plus-icon.png"
					/>
				</div>
				<div class="content">
					<p class="header">Custom chart</p>
				</div>
			</div>
			<div class="ui centered card" @click="$router.push({ name: 'ActiveMQ' })">
				<div class="image">
					<img src="https://pbs.twimg.com/profile_images/925778947677282304/ORWTRiA5_400x400.jpg" />
				</div>
				<div class="content">
					<p class="header">ActiveMQ chart</p>
				</div>
			</div>
			<div class="ui centered card" @click="$router.push({ name: 'Redis' })">
				<div class="image">
					<img src="https://cdn.auth0.com/blog/logos/redis-icon-logo.png" />
				</div>
				<div class="content">
					<p class="header">Redis chart</p>
				</div>
			</div>
		</div>
		<div class="ui divider"></div>
		<h2 class="ui header">Create Other</h2>
		<div class="ui ten doubling cards">
			<router-link class="ui centered card" tag="div" :to="{ name: 'Datasource' }">
				<div class="image">
					<img
						src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNLXjkMMHXBgG71TqX__8AnIYSjeL2v5ktnwMTRpEaMHFzZPfTk4sTQAtRLHnP0YRAHWXFlEWGA9kBOKcJC_E2bJFyPN1JtppiiQ&amp;usqp=CAU&amp;ec=45732301"
					/>
				</div>
				<div class="content">
					<p class="header">Create datasource</p>
				</div>
			</router-link>
			<router-link class="ui centered card" tag="div" :to="{ name: 'CreateAMQController' }">
				<div class="image">
					<img
						src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/wrench.png"
					/>
				</div>
				<div class="content">
					<p class="header">ActiveMQ controller</p>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style scoped>
.ui .card {
	cursor: pointer !important;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24) !important;
	transition: all 0.2s ease-in-out !important;
}
.ui .card:hover {
	cursor: pointer !important;
	box-shadow: 6px 6px 6px black !important;
	transform: translateY(-3px);
	-webkit-transform: translateY(-3px);
	-moz-transform: translateY(-3px);
	-ms-transform: translateY(-3px);
	-o-transform: translateY(-3px);
}
</style>
