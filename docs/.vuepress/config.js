module.exports = {
	base: "/dashboard/docs/",
	title: "Dashboard",
	description: "Just playing around",
	themeConfig: {
		search: false,
		nav: [
			{ text: "Home", link: "/" },
			{ text: "Guide", link: "/guide/" },
			{ text: "GitHub", link: "https://github.com/koha13/dashboard" },
		],
		sidebar: [
			{
				title: "Guide",
				collapsable: false,
				sidebarDepth: 1,
				initialOpenGroupIndex: 1,
				children: [
					{
						title: "Introduction",
						path: "/guide/introduction",
						sidebarDepth: 2,
					},
					{
						title: "How It Works",
						path: "/guide/how-it-works",
						sidebarDepth: 2,
					},
					{
						title: "Getting Started",
						path: "/guide/",
						sidebarDepth: 2,
					},
					{
						title: "Jmx Controller",
						path: "/guide/jmx-controller",
						sidebarDepth: 2,
					},
					{
						title: "Import And export",
						path: "/guide/import-export",
						sidebarDepth: 2,
					},
					{
						title: "Advanced Feature",
						path: "/guide/advanced-feature",
						sidebarDepth: 2,
					},
				],
			},
		],
	},
	plugins: [
		[
			"@vuepress/pwa",
			{
				serviceWorker: true,
				updatePopup: true,
			},
		],
		[
			"container",
			{
				type: "upgrade",
				before: (info) => `<UpgradePath title="${info}">`,
				after: "</UpgradePath>",
			},
		],
		["@vuepress/back-to-top", true],
		["@vuepress/medium-zoom", true],
	],
};
