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
	},
	mutations: {
		addBoard(state, value) {
			state.boards.push(value);
		},
		updateBoard(state, b) {
			for (let i = 0; i < state.boards.length; i++) {
				if (state.boards[i].name == b.name) {
					if (b.type === "Pie") {
						let data = [];
						b.fields.map((f) => {
							data.push({ name: f.name, y: f.value });
						});
						b.data = data;
						state.boards[i] = b;
					} else if (b.type === "Line") {
						for (let i = 0; i < b.fields.length; i++) {
							let check = false;
							for (let j = 0; j < b.data.length; j++) {
								if (b.fields[i].name === b.data[j].name) {
									b.data[j].data.push(b.fields[i].value);
									check = true;
									break;
								}
							}
							if (!check) {
								b.data.push({ name: b.fields[i].name, data: [b.fields[i].value] });
							}
						}
						state.boards[i] = b;
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
			return new Promise((resolve, reject) => {
				let b = getters.getBoard(value);
				b.fields.map((f) => {
					axios
						.get(f.url)
						.then((res) => {
							let path = f.path.split("/");
							let v = res.data;
							path.map((p) => {
								v = v[p];
							});
							f.value = v;
							commit("updateBoard", b);
							resolve();
						})
						.catch(() => {
							reject();
						});
				});
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
