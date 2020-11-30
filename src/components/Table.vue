<template>
	<div style="width:100%">
		<table class="ui celled striped table no-drag">
			<thead>
				<tr>
					<th colspan="3">
						{{ this.board.name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="a in board.data" :key="a.name">
					<td>{{ a.name }}</td>
					<td>{{ a.y }}</td>
				</tr>
			</tbody>
		</table>
		<div class="vue-draggable-handle">
			<i class="arrows alternate icon"></i>
		</div>
		<div class="close-handle" @click="deleteChart">
			<i class="window close outline icon"></i>
		</div>
		<div
			class="config-handle"
			@click="$router.push({ name: 'Chart', query: { name: board.name } })"
		>
			<i class="pencil alternate icon"></i>
		</div>
		<div class="ui message" v-if="log !== ''">
			<p>
				{{ log }}
			</p>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		board: Object,
	},
	mounted() {
		this.$store.dispatch("updateBoard", this.board.name).then((res) => {
			this.log = res;
			this.interval = setInterval(async () => {
				let log = await this.$store.dispatch("updateBoard", this.board.name);
			}, this.board.intervalTime);
		});
	},
	data() {
		return {
			interval: null,
			log: "",
		};
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.name);
			this.$emit("update");
		},
	},
};
</script>

<style></style>
