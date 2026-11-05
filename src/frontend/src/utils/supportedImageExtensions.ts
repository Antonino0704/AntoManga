import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from './endpoints';
import type { ValidateImageResponse } from '@/@types/interfaces';

async function validateImage(imageElement: HTMLInputElement): Promise<boolean> {
	if (imageElement.files!.length < 1) return false;
	if (!imageElement.files![0].type.startsWith('image/')) return false;
	const formData = new FormData();
	formData.append('image', imageElement.files![0]);
	try {
		return (
			await apiExpress.postImage<Promise<ValidateImageResponse>>(endpoints.validateImage, formData)
		).isValid;
	} catch (err) {
		console.log(err);
		return false;
	}
}

export { validateImage };
