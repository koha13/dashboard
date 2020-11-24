<template>
	<div>
		<div class="row">
			<table class="ui celled table">
				<thead>
					<tr>
						<th>Datasource Name</th>
						<th>option</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="f in datasources" :key="f.name">
						<td data-label="Field name">{{ f.datasourceName }}</td>
						<td>
							<button class="ui button negative" @click.prevent="deleteField(f.datasourceName)">
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
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
