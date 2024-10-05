import { csrftoken } from './csrf_token';

const baseEndpoint = '/api/';

async function getJSON(response: any) {
	if (response.status === 204) return '';
	return response.json();
}

function apiService(endpoint: string, method = 'GET', data: any = undefined, version: string = "v1/"): Promise<any> {
	const config: object = {
		method: method,
		body: data !== undefined ? JSON.stringify(data) : null,
		headers: {
			'content-type': 'application/json',
			'X-CSRFToken': csrftoken
		}
	};
	return fetch(baseEndpoint + version + endpoint, config)
		.then(getJSON)
		.catch((error) => console.log(error));
}

function imageApiService(endpoint: string, method = 'GET', data: any = undefined): Promise<any> {
	const config: object = {
		method: method,
		body: data,
		headers: {
			enctype: 'multipart/form-data',
			'X-CSRFToken': csrftoken
		}
	};
	return fetch(baseEndpoint + endpoint, config)
		.then(getJSON)
		.catch((error) => console.log(error));
}

export { apiService, imageApiService };
