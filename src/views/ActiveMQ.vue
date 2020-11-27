<template>
	<div>
		<form class="ui form">
			<div class="field">
				<label>Board name</label>
				<input type="text" v-model="boardName" />
			</div>
			<div class="field">
				<label>JMX URL</label>
				<input type="text" placeholder="Jmx url" v-model="jmxUrl" />
			</div>
			<div class="field">
				<label>Username</label>
				<input type="text" v-model="username" />
			</div>
			<div class="field">
				<label>Password</label>
				<input type="text" v-model="password" />
			</div>
			<button class="ui button" type="button" @click="show">Show</button>
		</form>
		<button class="ui button green" @click="submit">Create</button>
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
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import axios from "axios";

export default {
	name: "App",
	components: {
		VueJsonPretty,
	},
	data() {
		return {
			boardName: "",
			jmxUrl: "",
			username: "",
			password: "",
			renderOK: true,
			data: "",
			val: JSON.stringify(this.data),
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
			axios.get("http://localhost:8082/preview?jmx=" + this.jmxUrl).then((res) => {
				this.data = res.data;
			});
		},
		submit() {
			let id = this.$store.getters.getId;
			let board = {
				name: this.boardName,
				w: 6,
				h: 12,
				i: id,
				x: 0,
				y: 0,
				intervalTime: 5000,
				fields: [],
				data: [],
				type: "Line",
			};
			for (let o of this.value) {
				let spl = o.split(".");
				let rs = "org.apache.activemq";
				for (let i = 4; i < spl.length - 2; i++) {
					rs = rs.concat(spl[i]);
				}
				this.$store.commit("addDatasource", {
					type: "jmx",
					datasourceName: rs + "-" + spl[spl.length - 1],
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
					name: spl[spl.length - 1],
					datasourceName: rs + "-" + spl[spl.length - 1],
				});
			}
			this.$store.commit("addBoard", board);
			this.$router.push({ name: "Home" });
		},
	},
};
</script>
