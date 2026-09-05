const apiVersion = 'v7/';
const endpoints = {
	publishers: 'publishers/',
	imgPublishers: 'image/publishers/',
	series: 'series/',
	imgSeries: 'image/series/',
	types: 'types/',
	seriesLength: 'series-length/',
	seriesList: 'series-list/',
	imgSeriesList: 'image/series-list/',
	version: 'version/',
	license: 'license/',
	userMe: 'user-me/',
	validateImage: 'image/validate/',
	publisherStats: 'publisher-stats/',
	publishersShort: 'short-version/publishers/',
	createTicket: 'ticket/create/',
	labels: 'ticket/labels/'
};

Object.keys(endpoints).forEach(
	(key) =>
		(endpoints[key as keyof typeof endpoints] = `${apiVersion}${
			endpoints[key as keyof typeof endpoints]
		}`)
);
export { endpoints };
