import { imageApiService } from './APIService';
import { endpoints } from './endpoints';

async function validateImage(imageElement: HTMLInputElement) {
	if (!imageElement.files![0].type.startsWith('image/')) return false;

	const formData = new FormData();
	formData.append('image', imageElement.files![0]);
	let isValid = false;
	await imageApiService(endpoints.validateImage, 'POST', formData).then((response) => {
		isValid = response.isValid;
	});
	return isValid;
}

export { validateImage };
