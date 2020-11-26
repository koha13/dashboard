import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CreateChart from "../views/CreateChart.vue";
import AddDatasource from "../views/AddDatasource.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/create",
		name: "Chart",
		component: CreateChart,
	},
	{
		path: "/datasource",
		name: "Datasource",
		component: AddDatasource,
	},
	{
		path: "/about",
		name: "About",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/About.vue"),
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
