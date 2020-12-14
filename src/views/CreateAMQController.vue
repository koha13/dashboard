<template>
	<div
		class="ui four column centered grid"
		style="padding:15px; background:white; border-radius:5px; margin-top:20px"
	>
		<form @submit.prevent="submit" class="ui form" style="width:40%">
			<div class="field required">
				<label>Name</label>
				<input type="text" v-model="name" placeholder="Name" />
			</div>
			<div class="field required">
				<label>AMQ Url</label>
				<input type="text" v-model="url" placeholder="AMQ Url" />
				<div class="ui pointing label">
					{host}:{port} default port is 1099
				</div>
			</div>
			<div class="field">
				<label>Username</label>
				<input type="text" v-model="username" placeholder="Username" />
			</div>
			<div class="field">
				<label>Password</label>
				<input type="text" v-model="password" placeholder="Password" />
			</div>
			<button class="ui button primary" type="submit">Submit</button>
		</form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			name: "",
			url: "",
			username: "",
			password: "",
		};
	},
	methods: {
		submit() {
			this.$store.commit("addController", {
				name: this.name,
				url: `service:jmx:rmi:///jndi/rmi://${this.url}/jmxrmi`,
				username: this.username,
				password: this.password,
			});
			this.$router.push({ name: "Controllers" });
		},
	},
};
</script>

<style></style>
