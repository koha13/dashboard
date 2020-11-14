<template>
	<div class="ui grid">
		<div v-for="b in boards" :key="b.i" class="eight wide column">
			<Pie v-if="b.type == 'Pie'" :board="b" />
			<LineChart v-if="b.type == 'Line'" :board="b" />
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
	},
};
</script>
