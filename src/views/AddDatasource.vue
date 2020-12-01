<template>
	<div class="ui four column centered grid">
		<form class="ui form" @submit.prevent="submit" style="width:400px">
			<div class="field">
				<label>Type</label>
				<select class="ui fluid dropdown" v-model="data.type">
					<option value="json">JSON</option>
					<option value="jolokia">Jolokia</option>
					<option value="jmx">JMX</option>
					<option value="value">Fixed Value</option>
				</select>
			</div>
			<div :class="{ disabled: update, field: true, required: true }">
				<label>Datasource name </label>
				<input type="text" placeholder="datasource name" v-model="data.datasourceName" />
			</div>
			<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
				<label>URL</label>
				<input type="text" placeholder="url" v-model="data.json.url" />
			</div>
			<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
				<label>Method</label>
				<select class="ui fluid dropdown" v-model="data.json.method">
					<option value="GET">GET</option>
					<option value="POST">POST</option>
				</select>
			</div>
			<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
				<label>Config</label>
				<input type="text" placeholder="url" v-model="data.json.config" />
			</div>
			<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
				<label>Body</label>
				<input type="text" placeholder="url" v-model="data.json.body" />
			</div>
			<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
				<label>path</label>
				<input type="text" placeholder="path" v-model="data.json.path" />
			</div>
			<div class="field" v-if="data.type == 'jmx'">
				<label>JMX url</label>
				<input type="text" placeholder="jmx url" v-model="data.jmx.url" />
			</div>
			<div class="field" v-if="data.type == 'jmx'">
				<label>JMX auth</label>
				<div class="two fields">
					<div class="field">
						<input type="text" placeholder="username" v-model="data.jmx.username" />
					</div>
					<div class="field">
						<input type="text" placeholder="password" v-model="data.jmx.password" />
					</div>
				</div>
			</div>
			<div class="field" v-if="data.type == 'jmx'">
				<label>Object name</label>
				<input type="text" placeholder="object name" v-model="data.jmx.objectName" />
			</div>
			<div class="field" v-if="data.type == 'jmx'">
				<label>Attribute</label>
				<input type="text" placeholder="attribute" v-model="data.jmx.attribute" />
			</div>
			<div class="field" v-if="data.type == 'value'">
				<label>Value</label>
				<input type="text" placeholder="value" v-model="data.value" />
			</div>
			<button class="ui button secondary" type="button" @click="testDS">Test</button>
			<button class="ui button primary" type="submit">Submit</button>
		</form>
	</div>
</template>

<script>
export default {
	name: "datasource",
	created() {
		if (this.$route.query.name) {
			this.data = { ...this.$store.getters.getDatasource(this.$route.query.name) };
			this.update = true;
		}
	},
	data() {
		return {
			update: false,
			data: {
				type: "json",
				datasourceName: "",
				jmx: {
					url: "",
					objectName: "",
					attribute: "",
					username: "",
					password: "",
				},
				json: {
					url: "",
					path: "",
					method: "GET",
					config: "{}",
					body: "{}",
				},
				value: 0,
			},
		};
	},
	methods: {
		submit() {
			if (this.data.datasourceName == "") {
				this.$notify({
					group: "noti",
					title: "Datasource name can't be empty",
					type: "error",
				});
				return;
			}
			this.$store.commit("addDatasource", this.data);
			this.data = {
				type: "json",
				datasourceName: "",
				jmx: {
					url: "",
					objectName: "",
					attribute: "",
					username: "",
					password: "",
				},
				json: {
					url: "",
					path: "",
					method: "GET",
					config: "{}",
					body: "{}",
				},
				value: 0,
			};
			this.$router.push({ name: "Home" });
		},
		async testDS() {
			try {
				let a = await this.$store.dispatch("updateDatasourceWithDS", this.data);
				this.$notify({
					group: "noti",
					title: "Test datasource: OK",
					text: `Data get: ${a}`,
				});
			} catch (error) {
				this.$notify({
					group: "noti",
					title: "Test datasource: FAIL",
					text: `ERROR get: ${error}`,
					type: "error",
				});
			}
		},
	},
};
</script>

<style></style>
