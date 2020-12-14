const axios = require("axios");

async function combineAndGetData(dsList) {
	let combine = [];
	for (let ds of dsList) {
		if (combine.length == 0) {
			pushWhenEmpty(ds, combine);
		} else {
			let polymeric = false;
			for (let c of combine) {
				if (
					ds.type === "json" &&
					c.type === "json" &&
					c.url === ds.json.url &&
					c.method === ds.json.method &&
					c.config === ds.json.config &&
					c.body === ds.json.body
				) {
					polymeric = true;
					break;
				} else if (ds.type === "jmx" && c.type === "jmx" && c.url === ds.jmx.url) {
					let checkB = false;
					for (let b of c.bunch) {
						if (b.objectName === ds.jmx.objectName) {
							checkB = true;
							b.attributes.push(ds.jmx.attribute);
							break;
						}
					}
					if (!checkB) {
						c.bunch.push({
							objectName: ds.jmx.objectName,
							attributes: [ds.jmx.attribute],
						});
					}
					polymeric = true;
					break;
				} else if (ds.type === "redis" && c.type === "redis" && c.url === ds.redis.url) {
					let checkB = false;
					for (let b of c.bunch) {
						if (b.section === ds.redis.section) {
							checkB = true;
							b.attributes.push(ds.redis.attribute);
							break;
						}
					}
					if (!checkB) {
						c.bunch.push({
							section: ds.redis.section,
							attributes: [ds.redis.attribute],
						});
					}
					polymeric = true;
					break;
				}
			}
			if (!polymeric) {
				pushWhenEmpty(ds, combine);
			}
		}
	}
	let rs = await fetchData(combine, dsList);
	return rs;
}

async function fetchData(combine, dsList) {
	let rsDS = {};
	for (let c of combine) {
		if (c.type === "jmx") {
			try {
				let data = await axios.post("http://localhost:8082/newjmx", {
					url: c.url,
					username: c.username,
					password: c.password,
					bunch: c.bunch,
				});
				for (let ds of dsList) {
					if (ds.type === c.type && c.url === ds.jmx.url) {
						for (let d of data.data[ds.jmx.objectName]) {
							if (d.name == ds.jmx.attribute) {
								rsDS[ds.datasourceName] = d.value;
							}
						}
					}
				}
			} catch (error) {
				for (let ds of dsList) {
					if (ds.type === c.type && c.url === ds.jmx.url) {
						rsDS[ds.datasourceName] = "koha13FAILED";
					}
				}
			}
		} else if (c.type === "json") {
			try {
				let res = await axios({
					method: c.method,
					url: c.url,
					data: JSON.parse(c.body),
					config: JSON.parse(c.config),
				});
				for (let ds of dsList) {
					if (
						ds.type === "json" &&
						c.url === ds.json.url &&
						c.method === ds.json.method &&
						c.config === ds.json.config &&
						c.body === ds.json.body
					) {
						let data = res.data;
						if (ds.json.path != "") {
							let spl = ds.json.path.split("/");
							for (let i = 0; i < spl.length; i++) {
								data = data[spl[i]];
							}
						}
						let rsNum = parseFloat(data);
						if (isNaN(rsNum)) {
							rsDS[ds.datasourceName] = data;
						} else {
							rsDS[ds.datasourceName] = rsNum;
						}
					}
				}
			} catch (error) {
				for (let ds of dsList) {
					if (
						ds.type === "json" &&
						c.url === ds.json.url &&
						c.method === ds.json.method &&
						c.config === ds.json.config &&
						c.body === ds.json.body
					) {
						rsDS[ds.datasourceName] = "koha13FAILED";
					}
				}
			}
		} else if (c.type === "redis") {
			try {
				let data = await axios.post("http://localhost:8082/redis", {
					url: c.url,
					bunch: c.bunch,
				});
				for (let ds of dsList) {
					if (ds.type === "redis" && c.type === "redis" && c.url === ds.redis.url) {
						for (let d in data.data[ds.redis.section]) {
							if ((ds.redis.attribute = d)) {
								rsDS[ds.datasourceName] = data.data[ds.redis.section][d];
							}
						}
					}
				}
			} catch (error) {
				for (let ds of dsList) {
					if (ds.type === "redis" && c.type === "redis" && c.url === ds.redis.url) {
						rsDS[ds.datasourceName] = "koha13FAILED";
					}
				}
			}
		}
	}
	return rsDS;
}

function pushWhenEmpty(ds, combine) {
	if (ds.type === "json") {
		combine.push({
			type: "json",
			url: ds.json.url,
			method: ds.json.method,
			config: ds.json.config,
			body: ds.json.body,
		});
	} else if (ds.type === "jmx") {
		combine.push({
			type: "jmx",
			url: ds.jmx.url,
			username: ds.jmx.username,
			password: ds.jmx.password,
			bunch: [
				{
					objectName: ds.jmx.objectName,
					attributes: [ds.jmx.attribute],
				},
			],
		});
	} else if (ds.type === "redis") {
		combine.push({
			type: "redis",
			url: ds.redis.url,
			bunch: [
				{
					section: ds.redis.section,
					attributes: [ds.redis.attribute],
				},
			],
		});
	} else if (ds.type === "value") {
		combine.push({
			type: "value",
			name: ds.datasourceName,
			value: ds.value,
		});
	}
}

export { combineAndGetData };
