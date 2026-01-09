import {
	IHookFunctions,
	IDataObject,
	IExecuteFunctions,
	IWebhookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	JsonObject,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';
import type { ActaportPage, ActaportStaticData } from './ActaportTypes';

export function getApiBaseUrl(credentials: IDataObject): string {
	return (credentials.apiUrl as string) || 'https://app.actaport.de/v1';
}

export function getStaticData(context: IHookFunctions): ActaportStaticData {
	return context.getWorkflowStaticData('node') as ActaportStaticData;
}

export async function actaportApiRequest<T = IDataObject>(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject = {},
	query: IDataObject = {},
	uri?: string,
	options: IDataObject = {},
): Promise<T> {
	const credentials = await this.getCredentials('actaportOAuth2Api');
	const apiBaseUrl = getApiBaseUrl(credentials);

	const url = resolveUrl(apiBaseUrl, resource, uri);

	let requestOptions: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url,
		json: true,
	};

	requestOptions = { ...requestOptions, ...options };

	if (!Object.keys(body).length) {
		delete requestOptions.body;
	}
	if (!Object.keys(query).length) {
		delete requestOptions.qs;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(
			this,
			'actaportOAuth2Api',
			requestOptions,
		);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function actaportApiRequestGetAllPaginatedItems<T>(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	endpoint: string,
	query: IDataObject = {},
): Promise<T[]> {
	const returnData: T[] = [];
	let currentPageUrl: string | null = endpoint;
	const originalQuery = { ...query };

	let firstCall = true;

	while (currentPageUrl) {
		let responseData: ActaportPage<T>;

		try {
			if (firstCall) {
				responseData = (await actaportApiRequest.call(
					this,
					'GET',
					currentPageUrl,
					{},
					originalQuery,
				)) as ActaportPage<T>;
				firstCall = false;
			} else {
				responseData = (await actaportApiRequest.call(
					this,
					'GET',
					'',
					{},
					{},
					currentPageUrl,
				)) as ActaportPage<T>;
			}
		} catch (error) {
			throw new NodeApiError(this.getNode(), error as JsonObject);
		}

		if (responseData.content && Array.isArray(responseData.content)) {
			returnData.push(...responseData.content);
		}

		if (responseData._link?.next?.href) {
			currentPageUrl = responseData._link.next.href;
			continue;
		}

		const { number, size, last } = responseData;

		if (last === false && typeof number === 'number') {
			const nextPage = number + 1;

			const params: IDataObject = { ...originalQuery };
			params.page = nextPage;

			if (!originalQuery.size && size) {
				params.size = size;
			}

			const queryString = stringifyQuery(params);
			currentPageUrl = `${endpoint}?${queryString}`;
			continue;
		}

		currentPageUrl = null;
	}

	return returnData;
}

function stringifyQuery(params: IDataObject): string {
	const parts: string[] = [];

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null) continue;

		if (Array.isArray(value)) {
			for (const v of value) {
				parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
			}
		} else {
			parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
		}
	}

	return parts.join('&');
}

/**
 * Resolves the full URL for the API request.
 */
function resolveUrl(apiBaseUrl: string, resource: string, uri?: string): string {
	if (uri) {
		if (uri.startsWith('http://') || uri.startsWith('https://')) {
			return uri;
		}

		if (uri.startsWith('/')) {
			return apiBaseUrl.replace(/\/+$/, '') + uri;
		}

		return `${apiBaseUrl.replace(/\/+$/, '')}/${uri.replace(/^\/*/, '')}`;
	}

	return `${apiBaseUrl.replace(/\/+$/, '')}/${resource.replace(/^\/*/, '')}`;
}
