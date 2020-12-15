<template>
	<div class="ui grid" style="padding: 20px">
		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<div class="ui message">
				<ul class="list">
					<li>Enter jmx url then click show</li>
					<li>Pick attribute in json viewer in the right</li>
					<li>Enter boardname then click create</li>
				</ul>
			</div>
			<form class="ui form">
				<div class="field required">
					<label>Board name</label>
					<input type="text" placeholder="Board name" v-model="boardName" />
				</div>
				<div class="field">
					<label>JMX URL</label>
					<input type="text" placeholder="Jmx url" v-model="jmxUrl" />
					<div class="ui pointing label">
						service:jmx:rmi:///jndi/rmi://{host}:{port}/jmxrmi
					</div>
				</div>
				<div class="field">
					<label>Username</label>
					<input type="text" v-model="username" />
				</div>
				<div class="field">
					<label>Password</label>
					<input type="text" v-model="password" />
				</div>
				<div class="field">
					<label>Board type</label>
					<select class="ui fluid dropdown" v-model="boardType">
						<option value="Pie">Pie</option>
						<option value="Line">Line</option>
						<option value="Table">Table</option>
					</select>
				</div>
				<div class="field">
					<label>IntervalTime</label>
					<input type="text" v-model="intervalTime" />
				</div>
				<button class="ui orange button" type="button" @click="show">Show</button>
				<button class="ui button green" type="button" @click.prevent="submit">Create</button>
			</form>
		</div>

		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<vue-json-pretty
				v-if="renderOK"
				v-model="value"
				:data="data"
				:deep="deep"
				:show-double-quotes="showDoubleQuotes"
				:highlight-mouseover-node="highlightMouseoverNode"
				:highlight-selected-node="highlightSelectedNode"
				:show-length="showLength"
				:show-line="showLine"
				:select-on-click-node="selectOnClickNode"
				:collapsed-on-click-brackets="collapsedOnClickBrackets"
				:path-selectable="(path, data) => path.includes('attribute.')"
				:selectable-type="selectableType"
				:show-select-controller="showSelectController"
			/>
		</div>
	</div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import axios from "axios";

export default {
	name: "ActiveMQ",
	components: {
		VueJsonPretty,
	},
	data() {
		return {
			boardType: "Table",
			intervalTime: 5000,
			boardName: "",
			jmxUrl: "",
			username: "",
			password: "",
			renderOK: true,
			data: "",
			value: [],
			selectableType: "multiple",
			showSelectController: true,
			showLength: false,
			showLine: true,
			showDoubleQuotes: true,
			highlightMouseoverNode: true,
			highlightSelectedNode: true,
			selectOnClickNode: true,
			collapsedOnClickBrackets: true,
			useCustomLinkFormatter: false,
			path: "res",
			deep: 3,
			itemData: {},
			itemPath: "",
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
			axios
				.post(process.env.VUE_APP_BASE_API + "/previewjmx", {
					url: this.jmxUrl,
					username: this.username,
					password: this.password,
				})
				.then((res) => {
					this.data = res.data;
				})
				.catch((err) => {
					this.$notify({
						group: "noti",
						title: "Can't get jmx information",
						type: "error",
					});
				});
		},
		submit() {
			if (this.boardName.trim() === "") {
				this.$notify({
					group: "noti",
					title: "Board name can't be empty",
					type: "error",
				});
				return;
			}
			if (this.value.length === 0) {
				this.$notify({
					group: "noti",
					title: "Pick atleast one attribute",
					type: "error",
				});
				return;
			}
			let id = this.$store.getters.getId;
			let board = {
				name: this.boardName,
				w: 6,
				h: 12,
				i: id,
				x: 0,
				y: 0,
				intervalTime: this.intervalTime,
				fields: [],
				data: [],
				type: this.boardType,
			};
			for (let o of this.value) {
				let spl = o.split(".");
				let rs = "org.apache.activemq:";
				for (let i = 3; i < spl.length - 2; i++) {
					rs = rs.concat(",").concat(spl[i]);
				}
				let prefixName = "";
				for (let p of spl) {
					if (p.includes("destinationName")) {
						prefixName = p.split("=")[1];
						break;
					}
				}
				if (prefixName !== "") {
					prefixName += "-";
				}
				rs = rs.replace(/:,/g, ":");
				let datasourceName = spl[spl.length - 3].split("=")[1] + "-" + spl[spl.length - 1];
				this.$store.commit("addDatasource", {
					type: "jmx",
					datasourceName,
					jmx: {
						url: this.jmxUrl,
						objectName: rs,
						attribute: spl[spl.length - 1],
						username: this.username,
						password: this.password,
					},
					json: {
						url: "",
						path: "",
						method: "GET",
						config: "{}",
						body: "{}",
					},
					value: 0,
				});
				board.fields.push({
					name: prefixName + spl[spl.length - 1],
					datasourceName: datasourceName,
					warning: "",
				});
			}
			this.$store.commit("addBoard", board);
			this.data = "";
			this.$router.push({ name: "Home" });
		},
	},
};
</script>
