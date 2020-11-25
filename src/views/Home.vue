<template>
	<div>
		<div class="ui centered grid">
			<div class="five wide column">
				<table class="ui celled small table">
					<thead>
						<tr>
							<th>Datasource Name</th>
							<th>option</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="f in datasources" :key="f.name">
							<td data-label="Field name">{{ f.datasourceName }}</td>
							<td class="collapsing">
								<button
									class="ui mini button negative"
									@click.prevent="$store.commit('deleteDatasource', f.datasourceName)"
								>
									Delete
								</button>
								<button
									class="ui mini button primary"
									@click.prevent="$store.commit('deleteDatasource', f.datasourceName)"
								>
									Option
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="row">
			<div v-for="b in boards" :key="b.i" class="eight wide column">
				<Pie v-if="b.type == 'Pie'" :board="b" />
				<LineChart v-if="b.type == 'Line'" :board="b" />
			</div>
		</div>
	</div>
</template>

<script>
import Pie from "@/components/Pie";
import LineChart from "@/components/LineChart";

export default {
	components: {
		Pie,
		LineChart,
	},
	computed: {
		boards: {
			get() {
				return this.$store.state.boards;
			},
		},
		datasources: {
			get() {
				return this.$store.state.datasources;
			},
		},
	},
};
</script>
