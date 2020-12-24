let a = [
	{ name: "koha", id: 1 },
	{ name: "koha", id: 2 },
	{ name: "koha", id: 3 },
	{ name: "koha", id: 4 },
];
let r = a.reduce((rs, cur) => [...rs, cur.id], []);
console.log(r);
