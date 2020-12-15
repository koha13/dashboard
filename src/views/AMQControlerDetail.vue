<template>
	<div class="ui centered grid" style="padding-top:10px;margin-right:10px">
		<div class="row">
			<div class="ui message">
				<div class="header">
					ActiveMQ
				</div>
				<p>
					{{ this.url }}
				</p>
			</div>
		</div>
		<div class="row">
			<button class="ui secondary button" @click="restartController">
				<i class="sync alternate icon"></i>
				Restart
			</button>
			<button class="ui negative button" @click="gcController">
				<i class="trash alternate icon"></i>
				GC
			</button>
		</div>
		<div class="row">
			<div class="ui segment" style="width:100%; height:100%;padding:0;">
				<div :class="{ ui: true, active: dimmer, inverted: true, dimmer: true }">
					<div class="ui indeterminate text loader">Refresh data</div>
				</div>
				<table
					class="ui selectable celled small table"
					style="padding:0;margin:0;box-shadow: 3px 3px 10px;"
				>
					<thead>
						<tr>
							<th colspan="7">
								All connectors
								<button class="ui primary mini button" style="margin:0 10px" @click="fetchData">
									Refresh
								</button>
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
							<td :class="{ positive: con.connected, negative: !con.connected }">
								{{ con.connected }}
							</td>
							<td :class="{ positive: con.active, negative: !con.active }">
								{{ con.active }}
							</td>
							<td :class="{ positive: !con.slow, negative: con.slow }">
								{{ con.slow }}
							</td>
							<td>{{ con.destinations }}</td>
							<td class="collapsing">
								<button
									class="ui mini primary button"
									v-if="con.destinations.length > 0"
									@click="
										$router.push({
											name: 'ConnectorDetail',
											query: {
												objectName: con.consumer,
												url,
											},
										})
									"
								>
									Detail
								</button>
								<button class="ui mini negative button">Stop</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div id="confirm-modal" class="ui mini modal">
			<i class="close icon"></i>
			<div class="header">
				Confirm Safe Key
			</div>
			<div class="content">
				<div class="ui form">
					<div class="field">
						<label>Safe key</label>
						<input type="password" v-model="safekey" placeholder="****" />
					</div>
				</div>
			</div>
			<div class="actions" @click="safekey = ''">
				<div class="ui deny button">
					Cancel
				</div>
				<div class="ui positive button" @click="invoke">
					Confirm
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
	activated() {
		if (this.url != this.$route.query.url) {
			this.connectors = [];
			let { url, username, password } = this.$store.getters.getController(this.$route.query.url);
			this.url = url;
			this.username = username;
			this.password = password;
			if (url && url != "" && url !== "undefined") {
				this.fetchData();
			}
		}
	},
	created() {},
	data() {
		return {
			connectors: [],
			safekey: "",
			method: "",
			objectName: "",
			url: "",
			username: "",
			password: "",
			dimmer: false,
		};
	},
	methods: {
		async fetchData() {
			this.dimmer = true;
			this.connectors = [];
			try {
				let res = await this.$store.dispatch("fetchCon", {
					url: this.url,
					username: this.username,
					password: this.password,
				});
				setTimeout(() => {
					this.connectors = res;
					this.dimmer = false;
				}, 500);
			} catch (error) {
				setTimeout(() => {
					this.dimmer = false;
				}, 500);
			}
		},
		restartController() {
			this.method = "restart";
			this.objectName = "org.apache.activemq:type=Broker,brokerName=localhost";
			$("#confirm-modal").modal("show");
		},
		gcController() {
			this.method = "gc";
			this.objectName = "org.apache.activemq:type=Broker,brokerName=localhost";
			$("#confirm-modal").modal("show");
		},
		async invoke() {
			try {
				let data = await this.$store.dispatch("invoke", {
					safekey: this.safekey,
					method: this.method,
					objectName: this.objectName,
					url: this.url,
					username: this.username,
					password: this.password,
				});
				this.$notify({
					group: "noti",
					title: "Done",
				});
				this.safekey = "";
			} catch (error) {
				this.$notify({
					group: "noti",
					title: "Failed",
					type: "error",
				});
			} finally {
				this.safekey = "";
			}
		},
	},
};
</script>

<style></style>
