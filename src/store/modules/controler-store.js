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
	invoke({}, payload) {
		return new Promise((resolve, reject) => {
			switch (payload.method) {
				case "restart":
					axios
						.post("http://localhost:8082/activemq/restartAMQ", {
							url: payload.url,
							username: payload.username,
							password: payload.password,
							objectName: payload.objectName,
							safekey: payload.safekey,
						})
						.then(() => {
							resolve();
						})
						.catch((err) => {
							reject(err);
						});
					break;
				case "gc":
					axios
						.post("http://localhost:8082/activemq/gcAMQ", {
							url: payload.url,
							username: payload.username,
							password: payload.password,
							objectName: payload.objectName,
							safekey: payload.safekey,
						})
						.then(() => {
							resolve();
						})
						.catch((err) => {
							reject(err);
						});
					break;
				case "stop":
					axios
						.post("http://localhost:8082/activemq/stopConnector", {
							url: payload.url,
							username: payload.username,
							password: payload.password,
							objectName: payload.objectName,
							safekey: payload.safekey,
						})
						.then(() => {
							resolve();
						})
						.catch((err) => {
							reject(err);
						});
			}
		});
	},
};

const getters = {
	allControllers: (state) => state.controllers,
	getController: (state) => (url) => {
		for (let c of state.controllers) {
			if (c.url === url) {
				return c;
			}
		}
	},
};

export default {
	state,
	mutations,
	actions,
	getters,
};
