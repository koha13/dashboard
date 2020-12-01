export default function checkWarning(payload) {
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
}
