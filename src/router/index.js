import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CreateChart from "../views/CreateChart.vue";
import AddDatasource from "../views/AddDatasource.vue";
import ActiveMQ from "../views/ActiveMQ.vue";
import Redis from "../views/Redis.vue";
import Datasources from "../views/Datasources.vue";
import Create from "../views/Create.vue";
import Test from "../views/Test.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/chart",
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
	{
		path: "/redis",
		name: "Redis",
		component: Redis,
	},
	{
		path: "/ds",
		name: "Datasources",
		component: Datasources,
	},
	{
		path: "/create",
		name: "Create",
		component: Create,
	},
	{
		path: "/test",
		name: "Test",
		component: Test,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
