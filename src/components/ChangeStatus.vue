<template>
	<div style="position: absolute;top:0;right:0; width:50px;height:10px;font-size:10px;" v-if="show">
		<p style="float:right;color:black"><i :class="icon"></i>{{ data }}</p>
	</div>
</template>

<script>
export default {
	props: {
		v: [String, Number],
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
			if (oldVal != newVal) {
				if (typeof this.v === "number") {
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
					this.show = false;
				}
			}
		},
	},
};
</script>

<style></style>
