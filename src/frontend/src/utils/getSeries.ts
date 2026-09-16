import type { SeriesViewsetInstance, RequestObject } from '../@types/interfaces';
import { apiExpress } from '@/utils/APIExpress';

async function moreData(
	dataset: number,
	current: number,
	nextCard: string | null
): Promise<RequestObject> {
	const seriesData: RequestObject = {
		results: [] as Array<SeriesViewsetInstance>,
		next: nextCard,
		count: 0,
		previous: null
	};

	while ((current < dataset || dataset == -1) && seriesData.next != null) {
		const response = await apiExpress.get<RequestObject>(
			seriesData.next.replace(/\S*\/api\//g, '')
		);
		seriesData.results.push(...response.results);
		seriesData.next = response.next;
		current++;
	}
	return seriesData;
}

async function moreDataImage(
	dataset: number,
	current: number,
	nextImageCard: string | null
): Promise<RequestObject> {
	const seriesDataImg: RequestObject = {
		results: [] as Array<string>,
		next: nextImageCard,
		count: 0,
		previous: null
	};

	while ((current < dataset || dataset == -1) && seriesDataImg.next != null) {
		const response = await apiExpress.get<RequestObject>(
			seriesDataImg.next.replace(/\S*\/api\//g, '')
		);
		seriesDataImg.next = response.next;
		for (let i = 0; i < response.results.length; i++) {
			seriesDataImg.results.push(response.results[i].image);
		}
		current++;
	}
	return seriesDataImg;
}

export { moreData, moreDataImage };
