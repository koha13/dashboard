<template>
	<form class="ui form" @submit.prevent="submit">
		<div class="field">
			<label>State</label>
			<select class="ui fluid dropdown" v-model="data.type">
				<option value="json">JSON</option>
				<option value="jolokia">Jolokia</option>
				<option value="jmx">JMX</option>
				<option value="value">Fixed Value</option>
			</select>
		</div>
		<div class="field">
			<label>Datasource name</label>
			<input type="text" placeholder="datasource name" v-model="data.datasourceName" />
		</div>
		<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
			<label>URL</label>
			<input type="text" placeholder="url" v-model="data.url" />
		</div>
		<div class="field" v-if="data.type == 'json' || data.type == 'jolokia'">
			<label>path</label>
			<input type="text" placeholder="path" v-model="data.path" />
		</div>
		<div class="field" v-if="data.type == 'jmx'">
			<label>JMX url</label>
			<input type="text" placeholder="jmx url" v-model="data.jmxUrl" />
		</div>
		<div class="field" v-if="data.type == 'jmx'">
			<label>Object name</label>
			<input type="text" placeholder="object name" v-model="data.objectName" />
		</div>
		<div class="field" v-if="data.type == 'jmx'">
			<label>Attribute</label>
			<input type="text" placeholder="attribute" v-model="data.attribute" />
		</div>
		<div class="field" v-if="data.type == 'value'">
			<label>Value</label>
			<input type="text" placeholder="value" v-model="data.value" />
		</div>
		<button class="ui button primary" type="submit">Submit</button>
	</form>
</template>

<script>
export default {
	data() {
		return {
			data: {
				type: "json",
				datasourceName: "",
				url: "",
				path: "",
				jmxUrl: "",
				objectName: "",
				attribute: "",
				value: 0,
			},
		};
	},
	methods: {
		submit() {
			this.$store.commit("addDatasource", this.data);
		},
	},
};
</script>

<style></style>
