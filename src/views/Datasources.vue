<template>
	<div class="ui centered grid" style="width:100%;margin:0;padding:10px">
		<div class="row">
			<table
				class="ui selectable single line celled small table"
				style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)"
			>
				<thead>
					<tr>
						<th colspan="2">All Datasources</th>
					</tr>
					<tr>
						<th>Datasource Name</th>
						<th>option</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td colspan="2" style="text-align:center" v-if="datasources.length == 0">
							Create new datasource
							<router-link tag="button" to="/create" class="mini green ui icon button">
								<i class="icon plus square"></i>
							</router-link>
						</td>
					</tr>
					<tr v-for="f in datasources" :key="f.name">
						<td>{{ f.datasourceName }}</td>
						<td class="collapsing">
							<button class="ui mini button green" @click.prevent="updateDS(f.datasourceName)">
								Option
							</button>
							<button
								class="ui mini button negative"
								@click.prevent="$store.commit('deleteDatasource', f.datasourceName)"
							>
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
export default {
	computed: {
		datasources: {
			get() {
				return this.$store.state.datasources;
			},
		},
	},
	methods: {
		updateDS(name) {
			this.$router.push({ name: "Datasource", query: { name } });
		},
	},
};
</script>

<style></style>
