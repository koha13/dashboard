<template>
	<div
		style="position: absolute;top:0;right:0; width:100%;height:10px;font-size:10px;padding:0 3px"
		v-if="show"
	>
		<p style="float:right;color:black"><i :class="icon"></i>{{ data }}</p>
	</div>
</template>

<script>
export default {
	props: {
		v: [String, Number, Boolean],
	},
	data() {
		return {
			show: false,
			icon: "",
			data: 0,
		};
	},
	watch: {
		v: function(newVal, oldVal) {
			if (!isNaN(parseFloat(this.v))) {
				this.show = true;
				if (this.v > 0) {
					this.icon = "arrow up icon";
					this.data = this.v;
				} else if (this.v == 0) {
					this.icon = "minus icon";
					this.data = 0;
				} else {
					this.data = -this.v;
					this.icon = "arrow down icon";
				}
			} else {
				this.show = true;
				this.data = this.v;
				if (this.data === "") {
					this.icon = "minus icon";
				} else {
					this.icon = "sync icon";
				}
			}
		},
	},
};
</script>

<style></style>
