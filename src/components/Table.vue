<template>
	<div style="width:100%">
		<table class="ui celled selectable fixed unstackable striped table no-drag">
			<thead>
				<tr>
					<th colspan="2">
						{{ this.board.name }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="(a, index) in board.data"
					:key="index"
					:style="{
						background: a.warning ? a.warningColor + '32' : '',
						color: a.warning ? a.warningColor : '',
					}"
				>
					<td>{{ a.name }}</td>
					<td style="position: relative;" :class="{ blink: blink[index] }">
						{{ a.y }}
						<ChangeStatus :v="a.change" :key="board.name + a.name" />
					</td>
				</tr>
			</tbody>
		</table>
		<div>
			<div class="vue-draggable-handle">
				<i class="arrows alternate icon"></i>
			</div>
			<div class="close-handle" @click="deleteChart">
				<i class="window close outline icon"></i>
			</div>
			<div class="config-handle" @click="$router.push({ name: 'Chart', query: { id: board.i } })">
				<i class="pencil alternate icon"></i>
			</div>
		</div>

		<div class="ui message" v-if="log !== ''" style="font-size:12px">
			<p>
				{{ log }}
			</p>
		</div>
	</div>
</template>

<script>
import ChangeStatus from "@/components/ChangeStatus";
export default {
	components: {
		ChangeStatus,
	},
	props: {
		board: Object,
	},
	destroyed() {
		clearInterval(this.interval);
	},
	mounted() {
		this.$store.dispatch("updateBoard", this.board.i).then((res) => {
			this.log = res;
			this.interval = setInterval(async () => {
				this.log = await this.$store.dispatch("updateBoard", this.board.i);
			}, this.board.intervalTime);
		});
	},
	data() {
		return {
			interval: null,
			log: "",
			blink: JSON.parse(JSON.stringify(this.board.data)),
		};
	},
	methods: {
		deleteChart() {
			this.$store.commit("deleteChart", this.board.i);
			this.$emit("update");
		},
		blinkFunc() {
			for (let i = 0; i < this.board.data.length; i++) {
				if (this.board.data[i].change) {
					this.blink[i] = true;
				}
			}
			setTimeout(() => {
				this.blink.fill(false);
				this.$forceUpdate();
			}, 150);
		},
	},
	watch: {
		board: {
			handler(newVal, oldVal) {
				this.blinkFunc();
			},
			deep: true,
			immediate: false,
		},
	},
};
</script>
<style scoped>
.blink {
	background-color: rgba(159, 235, 159, 0.878);
}
</style>
