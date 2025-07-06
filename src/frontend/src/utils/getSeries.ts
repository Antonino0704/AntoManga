import type { SeriesViewsetInstance, RequestObject } from '../@types/interfaces';
import { apiService } from './APIService';

async function moreData(dataset: number, current: number, nextCard: string | null): Promise<any> {
	const seriesData = {
		series: [] as Array<SeriesViewsetInstance>,
		nextCard: nextCard
	};

	while ((current < dataset || dataset == -1) && seriesData.nextCard != null) {
		await apiService(seriesData.nextCard.replace(/\S*\/api\//g, '')).then((data: RequestObject) => {
			seriesData.series.push(...data.results);
			seriesData.nextCard = data.next;
		});
		current++;
	}
	return seriesData;
}

async function moreDataImage(
	dataset: number,
	current: number,
	nextImageCard: string | null
): Promise<any> {
	const seriesDataImg = {
		imageSeries: [] as Array<string>,
		nextImageCard: nextImageCard
	};

	while ((current < dataset || dataset == -1) && seriesDataImg.nextImageCard != null) {
		await apiService(seriesDataImg.nextImageCard.replace(/\S*\/api\//g, '')).then(
			(data: RequestObject) => {
				seriesDataImg.nextImageCard = data.next;
				for (let i = 0; i < data.results.length; i++) {
					seriesDataImg.imageSeries.push(data.results[i].image);
				}
			}
		);
		current++;
	}
	return seriesDataImg;
}

export { moreData, moreDataImage };
