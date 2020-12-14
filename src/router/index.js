import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import CreateChart from "../views/CreateChart.vue";
import AddDatasource from "../views/AddDatasource.vue";
import ActiveMQ from "../views/ActiveMQ.vue";
import Redis from "../views/Redis.vue";
import Datasources from "../views/Datasources.vue";
import Create from "../views/Create.vue";
import CreateAMQController from "../views/CreateAMQController.vue";
import Controllers from "../views/Controllers.vue";
import AMQControlerDetail from "../views/AMQControlerDetail.vue";
import ConnectorDetail from "../views/ConnectorDetail.vue";

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
		path: "/create-amq-controller",
		name: "CreateAMQController",
		component: CreateAMQController,
	},
	{
		path: "/controllers",
		name: "Controllers",
		component: Controllers,
	},
	{
		path: "/amq",
		name: "AMQControlerDetail",
		component: AMQControlerDetail,
	},
	{
		path: "/connector-detail",
		name: "ConnectorDetail",
		component: ConnectorDetail,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;
