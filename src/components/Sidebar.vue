<template>
	<div
		id="sidebar"
		class="ui left demo vertical three item visible sidebar labeled inverted icon menu"
		style="background:#24292e; border:none; box-shadow:none !important"
	>
		<router-link class="item" to="/" active-class="test">
			<i class="dashboard icon"></i>
			Dashboard
		</router-link>
		<router-link class="item" to="/ds">
			<i class="block layout icon"></i>
			Datasource
		</router-link>
		<router-link class="item" :to="{ name: 'Controllers' }">
			<i class="wrench icon"></i>
			Controllers
		</router-link>
		<router-link class="item" :to="{ name: 'Create' }">
			<i class="plus icon"></i>
			Create
		</router-link>
		<a class="item" @click="showImportModal">
			<i class="download icon"></i>
			Import
		</a>
		<a class="item" @click="showExportModal">
			<i class="cloud upload icon"></i>
			Export
		</a>
		<div id="exportModal" class="ui mini modal" style="width:400px">
			<i class="close icon"></i>
			<div class="header">Export data</div>
			<div class="content expData">
				<textarea
					rows="5"
					type="text"
					id="expData"
					:value="dataExport"
					style="width:80%; margin-left:10%;max-height:300px"
				/>
			</div>
			<div class="actions">
				<div class="ui black deny button">
					Close
				</div>
				<div class="ui positive button" @click="copyData">
					Copy
				</div>
			</div>
		</div>
		<div id="importModal" class="ui mini modal" style="width:400px">
			<i class="close icon"></i>
			<div class="header">Import data</div>
			<textarea
				name="Text1"
				cols="40"
				rows="5"
				style="width:80%;margin-left:10%"
				v-model="impData"
			></textarea>
			<div class="actions">
				<div class="ui black deny button">
					Close
				</div>
				<div class="ui positive button" @click="importData">
					Import
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			dataExport: "",
			impData: "",
		};
	},
	methods: {
		showExportModal() {
			if ($(window).width() < 600) {
				$("#sidebar").sidebar("hide");
			}
			$("#exportModal").modal("show");
			this.dataExport = JSON.stringify(this.$store.getters.getExportData);
			Object.freeze(this.dataExport);
		},
		showImportModal() {
			if ($(window).width() < 600) {
				$("#sidebar").sidebar("hide");
			}
			$("#importModal").modal("show");
		},
		copyData() {
			let data = document.querySelector("#expData");
			data.setAttribute("type", "text");
			data.select();
			try {
				var successful = document.execCommand("copy");
				this.$notify({
					group: "noti",
					title: "COPIED DATA TO CLIPBOARD",
				});
			} catch (err) {}
		},
		importData() {
			this.$store.commit("importData", this.impData);
			this.$notify({
				group: "noti",
				title: "IMPORT DATA: OK",
				text: `Reloading`,
			});
			setTimeout(() => {
				document.location.reload(true);
			}, 1000);
		},
	},
};
</script>
<style>
.router-link-active,
.router-link-exact-active {
	background-color: #f6f8fa !important;
	color: black !important;
}
</style>
