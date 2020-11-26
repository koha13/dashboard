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
					<div class="three fields">
						<div class="field">
							<input type="text" placeholder="Field name" v-model="fieldName" />
						</div>
						<div class="field">
							<VueSimpleSuggest
								v-model="datasourceName"
								placeholder="datasource name"
								:list="this.$store.getters.getDatasourcesName"
							/>
							<div class="ui pointing label">
								Support math operator: `ds1 (M)+(M) ds2`
							</div>
							<!-- <input type="text" placeholder="datasource name" v-model="datasourceName" /> -->
						</div>
						<div class="field">
							<button class="ui button primary" @click.prevent="addField">Add</button>
						</div>
					</div>
				</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>Name show up</th>
							<th>Datasource name</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="f in fields" :key="f.name">
							<td data-label="Field name">{{ f.name }}</td>
							<td data-label="Url">{{ f.datasourceName }}</td>
							<td>
								<button class="ui button negative" @click.prevent="deleteField(f.name)">
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
import VueSimpleSuggest from "vue-simple-suggest";
import "vue-simple-suggest/dist/styles.css";
export default {
	components: {
		VueSimpleSuggest,
	},
	data() {
		return {
			boardName: "",
			intervalTime: 5000,
			boardType: "Pie",
			fieldName: "",
			datasourceName: "",
			fields: [],
		};
	},

	methods: {
		addField() {
			this.fields.push({
				name: this.fieldName,
				datasourceName: this.datasourceName,
			});
			this.clearInput();
		},
		clearInput() {
			this.fieldName = "";
			this.datasourceName = "";
			this.intervalTime = 5000;
		},
		deleteField(fieldName) {
			this.fields = this.fields.filter((f) => fieldName !== f.name);
		},
		submit() {
			let id = this.$store.getters.getId;
			let data = {
				name: this.boardName,
				w: 6,
				h: 12,
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
