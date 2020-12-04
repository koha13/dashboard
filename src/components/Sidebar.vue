<template>
	<div class="ui left demo vertical three item visible sidebar labeled icon menu">
		<router-link class="item" to="/">
			<i class="dashboard icon"></i>
			Dashboard
		</router-link>
		<router-link class="item" to="/ds">
			<i class="block layout icon"></i>
			Datasource
		</router-link>
		<a class="item" @click="showModalCreate">
			<i class="plus icon"></i>
			Create
		</a>
		<a class="item" @click="showImportModal">
			<i class="download icon"></i>
			Import
		</a>
		<a class="item" @click="showExportModal">
			<i class="cloud upload icon"></i>
			Export
		</a>
		<div class="ui basic modal" id="modal-create">
			<div class="ui icon header">
				<i class="plus square icon"></i>
				Create
				<br />
				<br />
				<div class="actions">
					<div
						class="ui green ok inverted button"
						style="width:200px"
						@click="$router.push({ name: 'Chart' })"
					>
						New board
					</div>
					<div
						class="ui green ok inverted button"
						style="width:200px"
						@click="$router.push({ name: 'ActiveMQ' })"
					>
						New ActiveMQ monitor
					</div>
					<div
						class="ui green ok inverted button"
						style="width:200px"
						@click="$router.push({ name: 'Datasource' })"
					>
						New datasource
					</div>
				</div>
			</div>
		</div>
		<div id="exportModal" class="ui modal">
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
		<div id="importModal" class="ui modal">
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
		showModalCreate() {
			$("#modal-create").modal("show");
		},
		showExportModal() {
			$("#exportModal").modal("show");
			this.dataExport = JSON.stringify(this.$store.getters.getExportData);
			Object.freeze(this.dataExport);
		},
		showImportModal() {
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
