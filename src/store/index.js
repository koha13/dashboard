import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersist from "vuex-persist";

const vuexLocalStorage = new VuexPersist({
	key: "vuex", // The key to store the state on in the storage provider.
	storage: window.localStorage, // or window.sessionStorage or localForage
	// Function that passes the state and returns the state with only the objects you want to store.
	// reducer: state => state,
	// Function that passes a mutation and lets you decide if it should update the state in localStorage.
	// filter: mutation => (true)
});

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		boards: [],
		datasources: [],
	},
	mutations: {
		addDatasource(state, payload) {
			console.log("here");
			state.datasources.push(payload);
		},
		deletaDatasource(state, payload) {
			for (let i = 0; i < state.datasources.length; i++) {
				if (state.datasources[i].datasourceName === payload) {
					state.datasources.splice(i, 1);
					break;
				}
			}
		},
		addBoard(state, value) {
			state.boards.push(value);
		},
		updateBoard(state, b) {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name == b.name) {
					if (state.boards[i].type === "Pie") {
						let check = false;
						for (let j = 0; j < state.boards[i].data.length; j++) {
							if (state.boards[i].data[j].name === b.field) {
								check = true;
								state.boards[i].data[j].y = b.value;
								break;
							}
						}
						if (!check) {
							state.boards[i].data.push({ name: b.field, y: b.value });
						}
					} else if (state.boards[i].type === "Line") {
						let check = false;
						for (let j = 0; j < state.boards[i].data.length; j++) {
							if (state.boards[i].data[j].name === b.field) {
								state.boards[i].data[j].data.push(b.value);
								check = true;
								break;
							}
						}
						if (!check) {
							state.boards[i].data.push({ name: b.field, data: [b.value] });
						}
					}
					break;
				}
			}
		},
		deleteChart(state, value) {
			state.boards = state.boards.filter((b) => b.name !== value);
		},
	},
	actions: {
		updateBoard({ getters, commit }, value) {
			return new Promise(async (resolve, reject) => {
				let b = getters.getBoard(value);
				let log = "";
				let urls = [];
				b.fields.map((f) => {
					if (!urls.includes({ link: f.url, header: f.header, data: f.data })) {
						urls.push({ link: f.url, header: f.header, data: f.data });
					}
				});
				for (let i = 0; i < urls.length; i++) {
					try {
						let res = await axios.get(
							urls[i].link,
							JSON.parse(urls[i].data),
							JSON.parse(urls[i].header)
						);
						for (let j = 0; j < b.fields.length; j++) {
							if (b.fields[j].url === urls[i].link) {
								let f = b.fields[j];
								let path = f.path.split("/");
								let v = res.data;
								path.map((p) => {
									v = v[p];
								});
								commit("updateBoard", { name: b.name, field: f.name, value: v });
							}
						}
					} catch (error) {
						log = log.concat(`Can't update ${urls[i].link}. `);
					}
				}
				resolve(log);
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
	},
	modules: {},
	plugins: [vuexLocalStorage.plugin],
});
