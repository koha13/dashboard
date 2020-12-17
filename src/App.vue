<template>
	<div id="app">
		<div class="header-main" style="width:100vw; height:35px;background:white;position: relative;">
			<button class="ui icon button" style="background:transparent">
				<i class="bars icon" @click="toggleSidebar"></i>
			</button>
			<img
				src="https://icons-for-free.com/iconfiles/png/512/dashboard-1320568680781126244.png"
				alt=""
				style="width:35px; position: absolute;left: 50%;-ms-transform: translateX(-50%);transform: translateX(-50%);"
			/>
		</div>
		<Sidebar />
		<notifications group="noti" position="bottom left" />
		<div class="rv">
			<keep-alive exclude="chart,datasource,ActiveMQ,Redis">
				<router-view :key="$route.fullPath" />
			</keep-alive>
		</div>
	</div>
</template>
<script>
import Sidebar from "@/components/Sidebar";
export default {
	components: {
		Sidebar,
	},
	created() {
		this.$store.commit("deleteData");
		$(document).ready(() => {
			if ($(window).width() < 800) {
				$("#sidebar").removeClass("visible");
			}
			this.$store.commit("fixLayout");
		});
		$(window).resize(() => {
			var width = $(window).width();
			if (width < 800) {
				$("#sidebar").removeClass("visible");
				this.$store.commit("fixLayout");
			} else {
				$("#sidebar").addClass("visible");
			}
		});
	},
	methods: {
		toggleSidebar() {
			$("#sidebar").sidebar("show");
		},
	},
};
</script>
<style>
.header-main {
	display: none;
}
.rv {
	margin-left: 90px;
	margin-right: 5px;
}
@media only screen and (max-width: 800px) {
	.header-main {
		display: block !important;
	}
	.rv {
		margin-left: 0px;
		margin-right: 5px;
	}
}
</style>
