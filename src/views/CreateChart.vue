<template>
	<div class="ui four column centered grid">
		<div class="row">
			<form @submit.prevent="submit" class="ui form">
				<div class="field">
					<label>Board name</label>
					<input type="text" v-model="boardName" placeholder="Board name" />
				</div>
				<div class="field">
					<label>Last Name</label>
					<select class="ui fluid dropdown" v-model="boardType">
						<option value="Pie">Pie</option>
						<option value="Line">Line</option>
					</select>
				</div>
				<div class="field">
					<label>Interval time</label>
					<input type="text" v-model="intervalTime" placeholder="ms" />
				</div>
				<div class="field">
					<label>Add Field</label>
					<div class="four fields">
						<div class="field">
							<input type="text" placeholder="Field name" v-model="fieldName" />
						</div>
						<div class="field">
							<input type="text" placeholder="Url" v-model="fieldUrl" />
						</div>
						<div class="field">
							<input type="text" placeholder="Path" v-model="fieldPath" />
						</div>
						<div class="field">
							<button class="ui button primary" @click.prevent="addField">Add</button>
						</div>
					</div>
				</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>Field name</th>
							<th>Url</th>
							<th>Path</th>
							<th>option</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="f in fields" :key="f.name">
							<td data-label="Field name">{{ f.name }}</td>
							<td data-label="Url">{{ f.url }}</td>
							<td data-label="Path">{{ f.path }}</td>
							<td>
								<button class="ui button negative " @click.prevent="deleteField(f.name)">
									Delete
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<button class="ui button primary" type="submit">Submit</button>
			</form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			boardName: "",
			intervalTime: 0,
			boardType: "Pie",
			fieldName: "",
			fieldUrl: "",
			fieldPath: "",
			fields: [],
		};
	},

	methods: {
		addField() {
			this.fields.push({
				name: this.fieldName,
				url: this.fieldUrl,
				path: this.fieldPath,
				value: 0,
			});
			this.clearInput();
		},
		clearInput() {
			this.fieldName = "";
			this.fieldUrl = "";
			this.fieldPath = "";
		},
		deleteField(fieldName) {
			this.fields = this.fields.filter((f) => fieldName !== f.name);
		},
		submit() {
			let id = this.$store.getters.getId;
			console.log(id);
			let data = {
				name: this.boardName,
				w: 10,
				h: 8,
				i: id,
				x: 0,
				y: 0,
				intervalTime: this.intervalTime,
				fields: this.fields,
				data: [],
				type: this.boardType,
			};
			this.$store.commit("addBoard", data);
			this.$router.push({ name: "Home" });
		},
	},
};
</script>

<style></style>
