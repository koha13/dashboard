<template>
	<div class="ui stackable two column grid" style="width:100%;margin:0;padding:10px">
		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<!-- <div class="ui message">
				<ul class="list">
					<li>Enter jmx url then click show</li>
					<li>Pick attribute in json viewer in the right</li>
					<li>Enter boardname then click create</li>
				</ul>
			</div> -->
			<form class="ui form">
				<div class="field">
					<label>JMX URL</label>
					<input type="text" placeholder="Jmx url" v-model="jmxUrl" />
					<div class="ui pointing label">
						service:jmx:rmi:///jndi/rmi://{host}:{port}/jmxrmi
					</div>
				</div>
				<div class="field">
					<div class="two fields">
						<div class="field">
							<label>Username</label>
							<input type="text" v-model="username" placeholder="Username" />
						</div>
						<div class="field">
							<label>Password</label>
							<input type="text" v-model="password" placeholder="Password" />
						</div>
					</div>
				</div>
				<table class="ui basic selectable celled small table" style="padding:0;">
					<thead>
						<tr>
							<th colspan="7">
								Datasources
							</th>
						</tr>
						<tr>
							<th>Name</th>
							<th>Option</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(d, index) in ds" :key="d.name">
							<td>{{ d.datasourceName }}</td>
							<td class="collapsing">
								<button
									class="ui mini negative basic button"
									type="button"
									@click="deleteDS(index)"
								>
									Delete
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="field">
					<label>Add datasrouce to board (optional)</label>
					<VueSimpleSuggest v-model="boardName" :list="this.$store.getters.getAllBoardName" />
				</div>
				<button class="ui orange button" type="button" @click="show">Show</button>
				<button class="ui button green primary" type="button" @click.prevent="createDS">
					Create DS
				</button>
				<button class="ui button green" type="button" @click.prevent="addToBoard">
					Add to board
				</button>
			</form>
		</div>

		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<div class="ui segment">
				<vue-json-pretty
					:data="data"
					:deep="deep"
					:show-double-quotes="true"
					:highlight-mouseover-node="true"
					:show-length="false"
					:show-line="true"
					:select-on-click-node="false"
					:collapsed-on-click-brackets="true"
					:virtual="true"
					@click="elementClick"
					style="cursor:pointer"
				/>
				<div :class="['ui', { active: loading }, 'inverted', 'dimmer']">
					<div class="ui loader"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import VueSimpleSuggest from "vue-simple-suggest";
import "vue-simple-suggest/dist/styles.css";
import axios from "axios";

export default {
	name: "ActiveMQ",
	components: {
		VueJsonPretty,
		VueSimpleSuggest,
	},
	data() {
		return {
			boardName: "",
			jmxUrl: "",
			username: "",
			password: "",
			data: null,
			deep: 3,
			loading: false,
			ds: [],
		};
	},
	methods: {
		show() {
			if (this.jmxUrl.trim() === "") {
				this.$notify({
					group: "noti",
					title: "JMX Url is empty",
					type: "error",
				});
				return;
			}
			this.loading = true;
			axios
				.post(process.env.VUE_APP_BASE_API + "/previewjmx", {
					url: this.jmxUrl,
					username: this.username,
					password: this.password,
				})
				.then((res) => {
					this.data = res.data;
					this.loading = false;
				})
				.catch((err) => {
					this.loading = false;
					this.$notify({
						group: "noti",
						title: "Can't get jmx information",
						type: "error",
					});
				});
		},
		elementClick(path, data) {
			if (!path.includes("attribute.")) {
				return;
			}
			let spl = path.split(".");
			let rs = "org.apache.activemq:";
			for (let i = 3; i < spl.length - 2; i++) {
				rs = rs.concat(",").concat(spl[i]);
			}
			let prefixName = "";
			for (let i = spl.length - 1; i >= 0; i--) {
				if (spl[i].includes("clientId")) {
					let temp = spl[i].split("=")[1].split("-");
					prefixName = temp[temp.length - 1];
					break;
				} else if (spl[i].includes("destinationName")) {
					prefixName = spl[i].split("=")[1];
					break;
				}
			}
			if (prefixName !== "") {
				prefixName += "-";
			}
			rs = rs.replace(/:,/g, ":");
			let datasourceName = prefixName + spl[spl.length - 1];
			let check = false;
			for (let o of this.ds) {
				if (o.datasourceName === datasourceName) {
					check = true;
				}
			}
			if (!check) {
				this.ds.push({
					type: "jmx",
					datasourceName,
					jmx: {
						url: this.jmxUrl,
						objectName: rs,
						attribute: spl[spl.length - 1],
						username: this.username,
						password: this.password,
					},
				});
			}
		},
		deleteDS(index) {
			this.ds.splice(index, 1);
		},
		createDS() {
			if (this.ds.length === 0) {
				this.$notify({
					group: "noti",
					title: "Pick atleast one attribute",
					type: "error",
				});
				return;
			}
			for (let d of this.ds) {
				this.$store.commit("addDatasource", d);
			}
			// for (let o of this.value) {
			// 	let spl = o.split(".");
			// 	let rs = "org.apache.activemq:";
			// 	for (let i = 3; i < spl.length - 2; i++) {
			// 		rs = rs.concat(",").concat(spl[i]);
			// 	}
			// 	let prefixName = "";
			// 	for (let i = spl.length - 1; i >= 0; i--) {
			// 		if (spl[i].includes("clientId")) {
			// 			let temp = spl[i].split("=")[1].split("-");
			// 			prefixName = temp[temp.length - 1];
			// 			break;
			// 		} else if (spl[i].includes("destinationName")) {
			// 			prefixName = spl[i].split("=")[1];
			// 			break;
			// 		}
			// 	}
			// 	if (prefixName !== "") {
			// 		prefixName += "-";
			// 	}
			// 	rs = rs.replace(/:,/g, ":");
			// 	let datasourceName = prefixName + spl[spl.length - 1];
			// 	this.$store.commit("addDatasource", {
			// 		type: "jmx",
			// 		datasourceName,
			// 		jmx: {
			// 			url: this.jmxUrl,
			// 			objectName: rs,
			// 			attribute: spl[spl.length - 1],
			// 			username: this.username,
			// 			password: this.password,
			// 		},
			// 	});
			// }
			this.$notify({
				group: "noti",
				title: `Created ${this.ds.length} datasources`,
			});
		},
		addToBoard() {
			if (this.boardName.trim() === "") {
				this.$notify({
					group: "noti",
					title: "Board name can't be empty",
					type: "error",
				});
				return;
			}
			if (this.ds.length === 0) {
				this.$notify({
					group: "noti",
					title: "Pick atleast one attribute",
					type: "error",
				});
				return;
			}
			let idCheck = -1;
			if (this.isJson(this.boardName) && JSON.parse(this.boardName).id) {
				idCheck = JSON.parse(this.boardName).id;
			}
			let board = this.$store.getters.getBoard(idCheck);
			if (board == null) {
				let id = this.$store.getters.getId;
				board = {
					name: this.boardName,
					w: 6,
					h: 12,
					i: id,
					x: 0,
					y: 0,
					intervalTime: 5000,
					fields: [],
					data: [],
					type: "Table",
				};
			}
			for (let d of this.ds) {
				this.$store.commit("addDatasource", d);
				board.fields.push({
					name: d.datasourceName,
					datasourceName: d.datasourceName,
					warning: "",
				});
			}
			this.$store.commit("addBoard", board);
			this.$router.push({ name: "Home" });
		},
		isJson(item) {
			item = typeof item !== "string" ? JSON.stringify(item) : item;
			try {
				item = JSON.parse(item);
			} catch (e) {
				return false;
			}
			if (typeof item === "object" && item !== null) {
				return true;
			}
			return false;
		},
	},
};
</script>
