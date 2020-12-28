import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { checkWarning, updateDS } from "./cal";
import { combineAndGetData } from "./fetchData";
import controllerStore from "./modules/controler-store";

const vuexLocalStorage = new VuexPersist({
	key: "vuex",
	storage: window.localStorage,
});

const BASE_API_URL = process.env.VUE_APP_BASE_API;

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
				if (state.boards[i].i === payload.i) {
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
				if (state.boards[i].i == b.i) {
					let board = state.boards[i];
					if (board.type === "Pie") {
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
					} else if (board.type === "Table") {
						let warning = b.warning;
						let check = false;
						for (let j = 0; j < board.data.length; j++) {
							if (board.data[j].name === b.field) {
								check = true;
								if (!isNaN(parseFloat(b.value))) {
									board.data[j].change = b.value - board.data[j].y;
								} else {
									if (b.value === board.data[j].y) board.data[j].change = "";
									else board.data[j].change = board.data[j].y;
								}
								board.data[j].y = b.value;
								board.data[j].warning = warning;
								break;
							}
						}
						if (!check) {
							board.data.push({
								name: b.field,
								y: b.value,
								warning,
								warningColor: b.warningColor,
								change: b.value,
							});
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
			state.boards = state.boards.filter((b) => b.i !== value);
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
			state.controllerStore = data.controllerStore;
		},
		fixLayout(state) {
			let t = 0;
			for (let b of state.boards) {
				b.y = b.y + t;
				b.x = 0;
				b.w = 12;
				t += b.h;
			}
		},
		addFieldToBoard(state, payload) {
			for (let b of state.boards) {
				if (b.i === payload.i) {
					b.fields.push(payload.field);
					return;
				}
			}
		},
	},
	actions: {
		updateBoard({ getters, commit }, value) {
			return new Promise(async (resolve, reject) => {
				let b = getters.getBoard(value);
				let log = "";
				let fields = b.fields;
				let dsList = [];
				for (let i = 0; i < fields.length; i++) {
					try {
						let spl = fields[i].datasourceName.split(/\s*\(M\)\s*/);
						if (spl.length == 1) {
							dsList.push(getters.getDatasource(spl[0]));
						} else {
							for (let j = 0; j < spl.length; j++) {
								if (j % 2 === 0) {
									if (isNaN(parseFloat(spl[j]))) {
										dsList.push(getters.getDatasource(spl[j]));
									}
								}
							}
						}
					} catch (error) {
						reject(error);
					}
				}
				let dataDS = await combineAndGetData(dsList);
				for (let f of fields) {
					let spl = f.datasourceName.split(/\s*\(M\)\s*/);
					let value = 0;
					if (spl.length == 1) {
						if (dataDS[f.datasourceName] === "koha13FAILED") {
							log += `Can't update ${f.name}.\r\n`;
						} else {
							value = dataDS[f.datasourceName];
						}
					} else {
						let calArr = [];
						for (let j = 0; j < spl.length; j++) {
							if (j % 2 === 0) {
								if (!isNaN(parseFloat(spl[j]))) {
									calArr.push(spl[j].toString());
								} else {
									if (dataDS[spl[j]] === "koha13FAILED") {
										log += `Can't update ${f.name}. `;
										break;
									}
									let d = dataDS[spl[j]];
									calArr.push(d.toString());
								}
							} else {
								calArr.push(spl[j]);
							}
						}
						value = eval(calArr.join(""));
					}
					let warning = checkWarning({
						value,
						warningString: f.warning,
					});
					commit("updateBoard", {
						i: b.i,
						field: f.name,
						value,
						warning,
						warningColor: f.warningColor,
					});
				}
				resolve(log);
			});
		},

		updateDatasourceWithDS({}, datasource) {
			return new Promise(async (resolve, reject) => {
				updateDS(resolve, reject, datasource);
			});
		},
	},
	getters: {
		getId(state) {
			let max = 0;
			for (let b of state.boards) {
				if (b.i > max) max = b.i;
			}
			return max + 1;
		},
		getBoards(state) {
			return state.boards;
		},
		getAllBoardName(state) {
			return state.boards.reduce((rs, cur) => [...rs, { name: cur.name, id: cur.i }], []);
		},
		getBoard: (state) => (id) => {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].i === id) return state.boards[i];
			}
			return null;
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
	modules: { controllerStore },
	plugins: [vuexLocalStorage.plugin],
});
