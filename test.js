let a = "redis://localhost:6379";
let re = new RegExp(/.+(?=\/*)/);
let rs = a.substring(8).match(/.+(?=\/*)/);
// let rs = re.exec(a.substring(8));
console.log(rs[0]);
