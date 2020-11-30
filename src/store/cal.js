export default function checkWarning(payload) {
	let { value, warningString } = payload;
	if (warningString === "") {
		return false;
	}
	let warningSign = false;
	let compareOperatorList = ["<=", ">=", ">", "<", "==", "!="];
	let check = false;
	let v, rsNum;
	for (let co of compareOperatorList) {
		if (warningString.includes(co)) {
			ckeck = true;
			switch (co) {
				case "<":
					v = warningString.substring(1);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
						v = rsNum;
					}
					if (value < v) {
						warningSign = true;
					}
					break;
				case ">":
					v = warningString.substring(1);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
						v = rsNum;
					}
					if (value > v) {
						warningSign = true;
					}
					break;
				case "<=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
						v = rsNum;
					}
					if (value <= v) {
						warningSign = true;
					}
					break;
				case ">=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
						v = rsNum;
					}
					if (value >= v) {
						warningSign = true;
					}
					break;
				case "==":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
						v = rsNum;
					}
					if (value == v) {
						warningSign = true;
					}
					break;
				case "!=":
					v = warningString.substring(2);
					rsNum = parseFloat(v);
					if (rsNum === NaN) {
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
		if (rsNum === NaN) {
			v = rsNum;
		}
		if (value > v) {
			warningSign = true;
		}
	}
	return warningSign;
}
