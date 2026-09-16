import { csrftoken } from './csrf_token';

class APIExpress_class {
	private baseEndpoint = '/api/';
	private jsonConfig: RequestInit;
	private fileConfig: RequestInit;

	constructor() {
		this.jsonConfig = {
			method: '',
			body: null,
			headers: this.buildHeader()
		};
		this.fileConfig = {
			method: '',
			body: null,
			headers: this.buildHeader('multipart')
		};
	}

	private buildHeader(mode: 'json' | 'multipart' = 'json') {
		const headers = new Headers();
		if (mode === 'json') headers.set('Content-Type', 'application/json');
		if (csrftoken != null) headers.set('X-CSRFToken', csrftoken);
		return headers;
	}

	public async get<T>(endpoint: string): Promise<T> {
		this.jsonConfig.method = 'GET';
		const response = await fetch(this.baseEndpoint + endpoint, this.jsonConfig);
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status} ${response.statusText}`);
		}
		return response.json() as Promise<T>;
	}

	public async post<T>(endpoint: string, data: unknown): Promise<T> {
		this.jsonConfig.method = 'POST';
		this.jsonConfig.body = JSON.stringify(data);
		const response = await fetch(this.baseEndpoint + endpoint, this.jsonConfig);
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status} ${response.statusText}`);
		}
		return response.json() as Promise<T>;
	}

	public async put<T>(endpoint: string, data: unknown): Promise<T> {
		this.jsonConfig.method = 'PUT';
		this.jsonConfig.body = JSON.stringify(data);
		const response = await fetch(this.baseEndpoint + endpoint, this.jsonConfig);
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status} ${response.statusText}`);
		}
		return response.json() as Promise<T>;
	}

	public async delete<T>(endpoint: string): Promise<T | void> {
		this.jsonConfig.method = 'DELETE';
		const response = await fetch(this.baseEndpoint + endpoint, this.fileConfig);
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status} ${response.statusText}`);
		}
		if (response.status !== 204) return;
		return response.json() as Promise<T>;
	}

	public async putImage<T>(endpoint: string, data: FormData): Promise<T> {
		this.fileConfig.method = 'PUT';
		this.fileConfig.body = data;
		const response = await fetch(this.baseEndpoint + endpoint, this.fileConfig);
		if (!response.ok) {
			throw new Error(`Request failed: ${response.status} ${response.statusText}`);
		}
		return response.json() as Promise<T>;
	}
}

const APIExpress = new APIExpress_class();

export { APIExpress };
