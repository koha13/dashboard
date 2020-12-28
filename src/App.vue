<template>
	<div id="app" style="height:100vh">
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
		<Sidebar v-if="$route.name !== 'Error'" />
		<div class="rv">
			<div
				style="position: relative; top:50vh; transform: translateY(-50%); text-align: center;"
				v-if="$route.name === 'Home' && $store.getters.getBoards == 0"
			>
				<h3 class="ui">
					No board to show
				</h3>
				<p>
					Create new board
					<router-link tag="button" to="/create" class="circular green ui icon button">
						<i class="icon plus square"></i>
					</router-link>
				</p>
			</div>

			<keep-alive exclude="chart,datasource,ActiveMQ,Redis">
				<router-view :key="$route.fullPath" />
			</keep-alive>
		</div>
		<Canvas v-if="showCanvas && $route.name == 'Home'" />
		<notifications group="noti" position="bottom left" />
	</div>
</template>
<script>
import Sidebar from "@/components/Sidebar";
import Canvas from "@/components/Canvas";
export default {
	components: {
		Sidebar,
		Canvas,
	},
	data() {
		return {
			showCanvas: true,
		};
	},
	created() {
		this.$store.commit("deleteData");
		$(document).ready(() => {
			if ($(window).width() < 800) {
				this.showCanvas = false;
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
