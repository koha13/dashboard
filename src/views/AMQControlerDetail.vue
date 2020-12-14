<template>
	<div class="ui grid" style="margin: 20px">
		<div class="ui row">
			<div class="ui message">
				<div class="header">
					ActiveMQ
				</div>
				<p>
					{{ this.$route.params.url }}
				</p>
			</div>
		</div>
		<div class="ui row">
			<button class="ui secondary button">
				<i class="sync alternate icon"></i>
				Restart
			</button>
			<button class="ui negative button">
				<i class="trash alternate icon"></i>
				GC
			</button>
		</div>
		<table class="ui selectable celled small table" style="padding:0">
			<thead>
				<tr>
					<th colspan="7">
						All connectors
					</th>
				</tr>
				<tr>
					<th>ClientId</th>
					<th>RemoteAddress</th>
					<th>Connected</th>
					<th>Active</th>
					<th>Slow</th>
					<th>Destination</th>
					<th>Option</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="con in connectors" :key="con.objectName">
					<td>{{ con.clientId }}</td>
					<td>{{ con.remoteAddress }}</td>
					<td>{{ con.connected }}</td>
					<td>{{ con.active }}</td>
					<td>{{ con.slow }}</td>
					<td>{{ con.destinations }}</td>
					<td class="collapsing">
						<button class="ui mini button">Reset stat</button>
						<button class="ui mini negative button">Stop</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import axios from "axios";
export default {
	name: "Test",
	created() {
		let { url, username, password } = this.$route.params;
		this.$store.dispatch("fetchCon", { url, username, password }).then((res) => {
			this.connectors = res;
		});
	},
	data() {
		return {
			connectors: [],
		};
	},
};
</script>

<style></style>
