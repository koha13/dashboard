<template>
	<div class="ui centered grid" style="width:100%;margin:0;padding:10px">
		<div class="row">
			<div class="ui message">
				<div class="header">
					Connector
				</div>
				<p style="word-break: break-all;">
					{{ $route.query.objectName }}
				</p>
			</div>
		</div>
		<div class="row">
			<button
				:class="{ ui: true, green: true, button: true, disabled: dimmer }"
				@click="fetchData"
			>
				<i class="sync alternate icon"></i>
				Refresh
			</button>
		</div>
		<div class="row">
			<div class="ui segment" style="width:100%; height:100%;padding:0;">
				<div :class="{ ui: true, active: dimmer, inverted: true, dimmer: true }">
					<div class="ui indeterminate text loader">Refresh data</div>
				</div>
				<table
					class="ui unstackable selectable celled small table"
					style="padding:0;margin:0;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);"
				>
					<thead>
						<tr>
							<th>Attribute</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="con in data[$route.query.objectName]"
							:key="con.name"
							style="word-break: break-all;"
						>
							<td>{{ con.name }}</td>
							<td>{{ con.value }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "ConnectorDetail",
	data() {
		return {
			data: {},
			dimmer: true,
		};
	},
	created() {
		this.fetchData();
	},
	methods: {
		async fetchData() {
			this.dimmer = true;
			let dataFetch = {};
			try {
				dataFetch = await this.$store.dispatch("fetchConnectorData", {
					objectName: this.$route.query.objectName,
					url: this.$route.query.url,
				});
				setTimeout(() => {
					this.data = dataFetch;
					this.dimmer = false;
				}, 500);
			} catch (error) {
				setTimeout(() => {
					this.dimmer = false;
					this.$notify({
						group: "noti",
						title: "Failed",
						type: "error",
					});
				}, 500);
			}
		},
	},
};
</script>

<style></style>
