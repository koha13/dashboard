<template>
	<div
		class="ui four column centered grid"
		style="padding:15px; background:white; border-radius:5px; padding-top:20px"
	>
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
						</div>
						<div class="field" v-if="boardType === 'Table'">
							<input type="text" placeholder="Warning" v-model="warning" />
							<div class="ui pointing label">
								{{ stringTool }}
							</div>
						</div>
						<div class="one wide field" style="position: relative;" v-if="boardType === 'Table'">
							<input
								type="color"
								placeholder="Color"
								v-model="warningColor"
								style="position: relative; top:8px"
							/>
						</div>
					</div>
					<div class="field">
						<button class="ui button green" @click.prevent="addField">Add</button>
					</div>
				</div>
				<table class="ui celled table">
					<thead>
						<tr>
							<th>#</th>
							<th>Name show up</th>
							<th>Datasource name</th>
							<th>Warning</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(f, index) in fields" :key="index">
							<td data-label="#">{{ index + 1 }}</td>
							<td data-label="Field name">{{ f.name }}</td>
							<td data-label="Url">{{ f.datasourceName }}</td>
							<td data-label="Warning">{{ f.warning }}</td>
							<td>
								<button class="ui button positive" @click.prevent="updateField(index)">
									Update
								</button>
								<button class="ui button negative" @click.prevent="deleteField(index)">
									Delete
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				<button class="ui button green" type="submit">Submit</button>
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
						<div class="field" v-if="this.boardType === 'Table'">
							<input type="text" placeholder="Warning" v-model="updateFieldData.warning" />
							<div class="ui pointing label">
								{{ stringTool }}
							</div>
						</div>
						<div
							class="one wide field"
							style="position: relative;"
							v-if="this.boardType === 'Table'"
						>
							<input
								type="color"
								placeholder="Color"
								v-model="updateFieldData.warningColor"
								style="position: relative; top:8px"
							/>
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
			this.boardStored = JSON.parse(
				JSON.stringify(this.$store.getters.getBoard(this.$route.query.id))
			);
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
			warningColor: "#FF0000",
			updateFieldData: {
				id: 0,
				name: "",
				datasourceName: "",
				warning: "",
				warningColor: "",
			},
		};
	},

	methods: {
		addField() {
			this.fields.push({
				name: this.fieldName,
				datasourceName: this.datasourceName,
				warning: this.warning,
				warningColor: this.warningColor,
			});
			this.fieldName = "";
			this.datasourceName = "";
			this.warning = "";
		},
		updateField(i) {
			this.updateFieldData.id = i;
			this.updateFieldData.name = this.fields[i].name;
			this.updateFieldData.datasourceName = this.fields[i].datasourceName;
			this.updateFieldData.warning = this.fields[i].warning;
			this.updateFieldData.warningColor = this.fields[i].warningColor;
			$("#updateField").modal("show");
		},
		updateFieldDone() {
			let i = this.updateFieldData.id;
			this.fields[i].name = this.updateFieldData.name;
			this.fields[i].datasourceName = this.updateFieldData.datasourceName;
			this.fields[i].warning = this.updateFieldData.warning;
			this.fields[i].warningColor = this.updateFieldData.warningColor;
		},
		deleteField(i) {
			this.fields.splice(i, 1);
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
