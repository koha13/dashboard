import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersist from "vuex-persist";
import checkWarning from "./cal";

const vuexLocalStorage = new VuexPersist({
	key: "vuex",
	storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		boards: [],
		datasources: [],
	},
	mutations: {
		addDatasource(state, payload) {
			let id = -1;
			for (let i = 0; i < state.datasources.length; i++) {
				if (state.datasources[i].datasourceName === payload.datasourceName) {
					id = i;
					break;
				}
			}
			if (id >= 0) {
				state.datasources[id] = payload;
			} else {
				state.datasources.push(payload);
			}
		},
		deleteDatasource(state, payload) {
			let usage = false;
			for (let b of state.boards) {
				for (let f of b.fields) {
					if (f.datasourceName === payload) {
						usage = true;
						break;
					}
				}
			}
			if (usage) {
				Vue.notify({
					group: "noti",
					title: "Can not delete this Datasource",
					text: "Some boards are using this Datasource",
					type: "error",
				});
			} else {
				state.datasources = state.datasources.filter((b) => b.datasourceName !== payload);
			}
		},
		addBoard(state, payload) {
			let id = -1;
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name === payload.name) {
					id = i;
					break;
				}
			}
			if (id >= 0) {
				state.boards[id] = payload;
			} else {
				state.boards.push(payload);
			}
		},
		updateBoard(state, b) {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name == b.name) {
					let board = state.boards[i];
					if (board.type === "Pie" || board.type === "Table") {
						let warning = b.warning;
						let check = false;
						for (let j = 0; j < board.data.length; j++) {
							if (board.data[j].name === b.field) {
								check = true;
								board.data[j].y = b.value;
								board.data[j].warning = warning;
								break;
							}
						}
						if (!check) {
							board.data.push({ name: b.field, y: b.value, warning });
						}
					} else if (board.type === "Line") {
						let check = false;
						for (let j = 0; j < board.data.length; j++) {
							if (board.data[j].name === b.field) {
								board.data[j].data.push(b.value);
								if (board.data[j].data.length > 100) {
									board.data[j].data.shift();
								}
								check = true;
								break;
							}
						}
						if (!check) {
							board.data.push({ name: b.field, data: [b.value] });
						}
					}
					break;
				}
			}
		},
		deleteChart(state, value) {
			state.boards = state.boards.filter((b) => b.name !== value);
		},
		vuegrid(state, value) {
			state.boards = value;
		},
		deleteData(state) {
			if (state == null || !state || state == {} || state == []) return;
			for (let i = 0; i < state.boards.length; i++) {
				state.boards[i].data = [];
			}
		},
		importData(state, payload) {
			let data = JSON.parse(payload);
			state.boards = data.boards;
			state.datasources = data.datasources;
		},
	},
	actions: {
		updateBoard({ getters, commit, dispatch }, value) {
			return new Promise(async (resolve, reject) => {
				let b = getters.getBoard(value);
				let log = "";
				let fields = b.fields;
				for (let i = 0; i < fields.length; i++) {
					try {
						let spl = fields[i].datasourceName.split(/\s*\(M\)\s*/);
						if (spl.length == 1) {
							let data = await dispatch("updateDatasource", fields[i].datasourceName);
							let warning = checkWarning({ value: data, warningString: fields[i].warning });
							commit("updateBoard", { name: b.name, field: fields[i].name, value: data, warning });
						} else {
							let calArr = [];
							for (let j = 0; j < spl.length; j++) {
								if (j % 2 === 0) {
									let d = await dispatch("updateDatasource", spl[j]);
									calArr.push(d.toString());
								} else {
									calArr.push(spl[j]);
								}
							}
							let value = eval(calArr.join(""));
							let warning = checkWarning({ value, warningString: fields[i].warning });
							commit("updateBoard", {
								name: b.name,
								field: fields[i].name,
								value,
								warning,
							});
						}
					} catch (error) {
						console.log(error);
						log = log.concat(`Can't update ${fields[i].name} \r\n`);
					}
				}
				resolve(log);
			});
		},

		updateDatasource({ getters, dispatch }, datasourceName) {
			let datasource = getters.getDatasource(datasourceName);
			return new Promise(async (resolve, reject) => {
				dispatch("updateDS", { resolve, reject, datasource });
			});
		},

		updateDatasourceWithDS({ dispatch }, datasource) {
			return new Promise(async (resolve, reject) => {
				dispatch("updateDS", { resolve, reject, datasource });
			});
		},

		async updateDS({}, payload) {
			let { resolve, reject, datasource } = payload;
			if (datasource.type === "json") {
				let res;
				try {
					res = await axios({
						method: datasource.json.method,
						url: datasource.json.url,
						data: JSON.parse(datasource.json.body),
						config: JSON.parse(datasource.json.config),
					});
					res = res.data;
					if (datasource.json.path != "") {
						let spl = datasource.json.path.split("/");
						for (let i = 0; i < spl.length; i++) {
							res = res[spl[i]];
						}
					}
					let rsNum = parseFloat(res);
					if (rsNum === NaN) {
						resolve(res);
					}
					resolve(rsNum);
				} catch (error) {
					console.log(error);
					reject(error);
				}
			} else if (datasource.type === "jmx") {
				let res;
				try {
					res = await axios.post("http://192.168.40.158:8082/get", {
						username: datasource.jmx.username,
						password: datasource.jmx.password,
						jmxUrl: datasource.jmx.url,
						objectName: datasource.jmx.objectName,
						attribute: datasource.jmx.attribute,
					});
					res = res.data;
					let rsNum = parseFloat(res);
					if (rsNum === NaN) {
						resolve(res);
					}
					resolve(rsNum);
				} catch (error) {
					reject(error);
				}
			}
		},
	},
	getters: {
		getId(state) {
			return state.boards.length + 1;
		},
		getBoards(state) {
			return state.boards;
		},
		getBoard: (state) => (id) => {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name === id) return state.boards[i];
			}
		},
		getDatasource: (state) => (id) => {
			for (let i = 0; i < state.datasources.length; i++) {
				if (state.datasources[i].datasourceName === id) return state.datasources[i];
			}
		},
		getDatasourcesName(state) {
			let rs = [];
			for (let i = 0; i < state.datasources.length; i++) {
				rs.push(state.datasources[i].datasourceName);
			}
			return rs;
		},
		getExportData(state) {
			let data = JSON.parse(JSON.stringify(state));
			for (let i = 0; i < data.boards.length; i++) {
				data.boards[i].data = [];
			}
			return data;
		},
	},
	modules: {},
	plugins: [vuexLocalStorage.plugin],
});
