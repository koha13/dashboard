<template>
	<div class="ui nine column centered grid" style="padding: 10px">
		<div class="row">
			<form @submit.prevent="submit" class="ui form">
				<div :class="{ field: true, required: true }">
					<label>Board name</label>
					<input type="text" v-model="boardName" placeholder="Board name" />
				</div>
				<div class="field">
					<label>Last Name</label>
					<select class="ui fluid dropdown" v-model="boardType">
						<option value="Pie">Pie</option>
						<option value="Line">Line</option>
						<option value="Table">Table</option>
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
							<input type="text" placeholder="Warning" v-model="warning" />
							<div class="ui pointing label">
								{{ stringTool }}
							</div>
						</div>
					</div>
					<div class="field">
						<button class="ui button primary" @click.prevent="addField">Add</button>
					</div>
				</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>Name show up</th>
							<th>Datasource name</th>
							<th>Warning</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="f in fields" :key="f.name">
							<td data-label="Field name">{{ f.name }}</td>
							<td data-label="Url">{{ f.datasourceName }}</td>
							<td data-label="Warning">{{ f.warning }}</td>
							<td>
								<button class="ui button positive" @click.prevent="updateField(f.name)">
									Update
								</button>
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
		<div class="ui basic modal" id="updateField">
			<div class="ui icon header">
				<i class="pencil alternate icon"></i>
				Update Field
			</div>
			<div class="content ui form">
				<div class="field">
					<div class="three fields">
						<div class="field">
							<input type="text" placeholder="Field name" v-model="updateFieldData.name" />
						</div>
						<div class="field">
							<VueSimpleSuggest
								v-model="updateFieldData.datasourceName"
								placeholder="datasource name"
								:list="this.$store.getters.getDatasourcesName"
							/>
							<div class="ui pointing label">
								Support math operator: `ds1 (M)+(M) ds2`
							</div>
							<!-- <input type="text" placeholder="datasource name" v-model="datasourceName" /> -->
						</div>
						<div class="field">
							<input type="text" placeholder="Warning" v-model="updateFieldData.warning" />
							<div class="ui pointing label">
								{{ stringTool }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="actions">
				<div class="ui red basic cancel inverted button">
					Cancel
				</div>
				<div class="ui green ok inverted button" @click="updateFieldDone">
					Update
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueSimpleSuggest from "vue-simple-suggest";
import "vue-simple-suggest/dist/styles.css";
export default {
	name: "chart",
	components: {
		VueSimpleSuggest,
	},
	created() {
		if (this.$route.query.id) {
			this.boardStored = this.$store.getters.getBoard(this.$route.query.id);
			this.update = true;
			this.boardName = this.boardStored.name;
			this.intervalTime = this.boardStored.intervalTime;
			this.boardType = this.boardStored.type;
			this.fields = this.boardStored.fields;
		}
	},
	data() {
		return {
			update: false,
			boardName: "",
			intervalTime: 5000,
			boardType: "Pie",
			fieldName: "",
			datasourceName: "",
			warning: "",
			fields: [],
			stringTool: ">, <, >=, <=, ==, !=. Default is >",
			boardStored: null,
			updateFieldData: {
				name: "",
				datasourceName: "",
				warning: "",
			},
		};
	},

	methods: {
		addField() {
			this.fields.push({
				name: this.fieldName,
				datasourceName: this.datasourceName,
				warning: this.warning,
			});
			this.fieldName = "";
			this.datasourceName = "";
			this.warning = "";
		},
		updateField(fieldName) {
			for (let f of this.fields) {
				if (f.name === fieldName) {
					this.updateFieldData.name = f.name;
					this.updateFieldData.datasourceName = f.datasourceName;
					this.updateFieldData.warning = f.warning;
					break;
				}
			}
			$("#updateField").modal("show");
		},
		updateFieldDone() {
			for (let f of this.fields) {
				if (f.name === this.updateFieldData.name) {
					f.name = this.updateFieldData.name;
					f.datasourceName = this.updateFieldData.datasourceName;
					f.warning = this.updateFieldData.warning;
					break;
				}
			}
		},
		deleteField(fieldName) {
			this.fields = this.fields.filter((f) => fieldName !== f.name);
		},
		submit() {
			if (this.boardName.trim() === "") {
				this.$notify({
					group: "noti",
					title: "Board name can't be empty",
					type: "error",
				});
				return;
			} else if (this.fields.length == 0) {
				this.$notify({
					group: "noti",
					title: "Fields = 0?",
					type: "error",
				});
				return;
			}
			let id = this.$store.getters.getId;
			let w = 6,
				h = 12,
				x = 0,
				y = 0;
			if (this.update) {
				id = this.boardStored.i;
				w = this.boardStored.w;
				h = this.boardStored.h;
				x = this.boardStored.x;
				y = this.boardStored.y;
			}
			let data = {
				name: this.boardName,
				w,
				h,
				i: id,
				x,
				y,
				intervalTime: this.intervalTime,
				fields: this.fields,
				data: [],
				type: this.boardType,
			};
			this.$store.commit("addBoard", data);
			this.fieldName = "";
			this.datasourceName = "";
			this.intervalTime = 5000;
			this.boardName = "";
			this.fields = [];
			this.boardType = "Pie";
			this.$router.push({ name: "Home" });
		},
	},
};
</script>

<style></style>
