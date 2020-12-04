import axios from "axios";

const checkWarning = function(payload) {
	let { value, warningString } = payload;
	if (warningString === "" || !warningString) {
		return false;
	}
	let warningSign = false;
	let compareOperatorList = ["<=", ">=", ">", "<", "==", "!="];
	var check = false;
	let v, rsNum;
	for (let co of compareOperatorList) {
		if (warningString.includes(co)) {
			check = true;
			switch (co) {
				case "<":
					v = warningString.substring(1);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value < v) {
						warningSign = true;
					}
					break;
				case ">":
					v = warningString.substring(1);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value > v) {
						warningSign = true;
					}
					break;
				case "<=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value <= v) {
						warningSign = true;
					}
					break;
				case ">=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value >= v) {
						warningSign = true;
					}
					break;
				case "==":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value == v) {
						warningSign = true;
					}
					break;
				case "!=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (isNaN(rsNum)) {
						v = rsNum;
					}
					if (value != v) {
						warningSign = true;
					}
					break;
			}
			break;
		}
	}
	if (!check) {
		v = warningString;
		rsNum = parseFloat(v);
		if (isNaN(rsNum)) {
			v = rsNum;
		}
		if (value > v) {
			warningSign = true;
		}
	}
	return warningSign;
};

const updateDS = async function(resolve, reject, datasource, BASE_API_URL) {
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
			if (isNaN(rsNum)) {
				resolve(res);
			}
			resolve(rsNum);
		} catch (error) {
			reject(error);
		}
	} else if (datasource.type === "jmx") {
		let res;
		try {
			res = await axios.post(BASE_API_URL + "/get", {
				username: datasource.jmx.username,
				password: datasource.jmx.password,
				jmxUrl: datasource.jmx.url,
				objectName: datasource.jmx.objectName,
				attribute: datasource.jmx.attribute,
			});
			res = res.data;
			let rsNum = parseFloat(res);
			if (isNaN(rsNum)) {
				resolve(res);
			}
			resolve(rsNum);
		} catch (error) {
			reject(error);
		}
	} else if (datasource.type === "value") {
		let rsNum = parseFloat(datasource.value);
		if (isNaN(rsNum)) {
			resolve(res);
		}
		resolve(rsNum);
	} else if (datasource.type === "redis") {
		let res;
		try {
			res = await axios.post(BASE_API_URL + "/redis", {
				url: datasource.redis.url,
				attr: datasource.redis.attribute,
				section: datasource.redis.section,
			});
			res = res.data;
			let rsNum = parseFloat(res);
			if (isNaN(rsNum)) {
				resolve(res);
			}
			resolve(rsNum);
		} catch (error) {
			reject(error);
		}
	}
};

export { checkWarning, updateDS };
