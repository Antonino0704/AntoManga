const apiVersion = 'v7/';
const endpoints = {
	publishers: `${apiVersion}publishers/`,
	imgPublishers: `${apiVersion}image/publishers/`,
	series: `${apiVersion}series/`,
	imgSeries: `${apiVersion}image/series/`,
	types: `${apiVersion}types/`,
	isAuthenticated: `${apiVersion}isAuthenticated/`,
	seriesLength: `${apiVersion}series-length/`,
	seriesList: `${apiVersion}series-list/`,
	imgSeriesList: `${apiVersion}image/series-list/`,
	version: `${apiVersion}version/`,
	license: `${apiVersion}license/`,
	userMe: `${apiVersion}user-me/`,
	validateImage: `${apiVersion}image/validate/`,
	publisherStats: `${apiVersion}publisher-stats/`,
	publishersShort: `${apiVersion}short-version/publishers/`,
	createTicket: `${apiVersion}ticket/create/`,
	labels: `${apiVersion}ticket/labels/`
};

export { endpoints };
