import axios from "axios";

const state = () => ({
	controllers: [],
});

const mutations = {
	addController(state, value) {
		state.controllers.push(value);
	},
	deleteController(state, value) {
		state.controllers = state.controllers.filter((b) => b.url !== value);
	},
};

const actions = {
	fetchCon({}, payload) {
		return new Promise((resolve, reject) => {
			axios
				.post("http://localhost:8082/activemq/connectors", {
					url: payload.url,
					username: payload.username,
					password: payload.password,
				})
				.then((res) => {
					resolve(res.data);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},
};

const getters = {
	allControllers: (state) => state.controllers,
};

export default {
	state,
	mutations,
	actions,
	getters,
};
