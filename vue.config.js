module.exports = {
	publicPath:
		process.env.NODE_ENV === "production"
			? "/dashboard/" // Thay tên repository vào đây!!!
			: "/",
};
