import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
	key: "vuex", // The key to store the state on in the storage provider.
	storage: window.localStorage, // or window.sessionStorage or localForage
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
			console.log(id);
			if (id >= 0) {
				state.datasources[id] = payload;
			} else {
				state.datasources.push(payload);
			}
		},
		deleteDatasource(state, payload) {
			state.datasources = state.datasources.filter((b) => b.datasourceName !== payload);
		},
		addBoard(state, value) {
			state.boards.push(value);
		},
		updateBoard(state, b) {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name == b.name) {
					let board = state.boards[i];
					if (board.type === "Pie") {
						let check = false;
						for (let j = 0; j < board.data.length; j++) {
							if (board.data[j].name === b.field) {
								check = true;
								board.data[j].y = b.value;
								break;
							}
						}
						if (!check) {
							board.data.push({ name: b.field, y: b.value });
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
	},
	actions: {
		updateBoard({ getters, commit, dispatch }, value) {
			return new Promise(async (resolve, reject) => {
				let b = getters.getBoard(value);
				let log = "";
				let fields = b.fields;
				for (let i = 0; i < fields.length; i++) {
					try {
						let data = await dispatch("updateDatasource", fields[i].datasourceName);
						commit("updateBoard", { name: b.name, field: fields[i].name, value: data });
					} catch (error) {
						log = log.concat(`Can't update ${fields[i].name} \r\n`);
					}
				}
				resolve(log);
			});
		},

		updateDatasource({ getters }, datasourceName) {
			let datasource = getters.getDatasource(datasourceName);
			return new Promise(async (resolve, reject) => {
				if (datasource.type === "json") {
					let res;
					try {
						res = await axios.get(datasource.url);
						res = res.data;
						if (datasource.path != "") {
							let spl = datasource.path.split("/");
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
						reject(error);
					}
				} else if (datasource.type === "jmx") {
					let res;
					try {
						res = await axios.post("http://localhost:8082/get", {
							username: "",
							password: "",
							jmxUrl: datasource.jmxUrl,
							objectName: datasource.objectName,
							attribute: datasource.attribute,
						});
						res = res.data;
						if (datasource.path != "") {
							let spl = datasource.path.split("/");
							for (let i = 0; i < spl.length; i++) {
								res = res[spl[i]];
							}
						}
						resolve(res);
					} catch (error) {
						reject(error);
					}
				}
			});
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
	},
	modules: {},
	plugins: [vuexLocalStorage.plugin],
});
