import { apiExpress } from '@/utils/APIExpress';
import { endpoints } from './endpoints';

async function validateImage(imageElement: HTMLInputElement): Promise<boolean> {
	if (imageElement.files!.length < 1) return false;
	if (!imageElement.files![0].type.startsWith('image/')) return false;
	const formData = new FormData();
	formData.append('image', imageElement.files![0]);
	try {
		return await apiExpress.postImage<Promise<boolean>>(endpoints.validateImage, formData);
	} catch (err) {
		console.log(err);
		return false;
	}
}

export { validateImage };
