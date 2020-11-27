import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CreateChart from "../views/CreateChart.vue";
import AddDatasource from "../views/AddDatasource.vue";
import ActiveMQ from "../views/ActiveMQ.vue";

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
		path: "/activemq",
		name: "ActiveMQ",
		component: ActiveMQ,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
