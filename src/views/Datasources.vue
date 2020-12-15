<template>
	<div class="ui centered grid" style="padding-top:10px;margin-right:10px">
		<div class="row">
			<table
				class="ui fixed selectable single line celled small table"
				style="box-shadow: 3px 3px 10px;"
			>
				<thead>
					<tr>
						<th class="twelve wide">Datasource Name</th>
						<th class="four wide">option</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="f in datasources" :key="f.name">
						<td data-label="Field name">{{ f.datasourceName }}</td>
						<td class="collapsing">
							<button class="ui mini button primary" @click.prevent="updateDS(f.datasourceName)">
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
