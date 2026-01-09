import { ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult } from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type ContactSearchItem = {
	id: string;
	anzeigename: string;
};

type ContactSearchResponse = {
	totalElements: number;
	content: ContactSearchItem[];
};

export async function getContacts(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 0;
	const per_page = 100;

	let responseData: ContactSearchResponse = {
		content: [],
		totalElements: 0,
	};

	try {
		const qs = { page: page, size: per_page };

		if (filter) {
			Object.assign(qs, { filter: `contains(name,'${filter}')` });
		}
		responseData = (await actaportApiRequest.call(
			this,
			'GET',
			'/kontakte',
			{},
			qs,
			undefined,
		)) as ContactSearchResponse;
	} catch (error) {
		this.logger?.warn('Error fetching contacts: ' + (error as Error).message);
		// Ignore errors for user search
	}

	const results: INodeListSearchItems[] = responseData.content.map((item: ContactSearchItem) => ({
		name: item.anzeigename,
		value: item.id,
	}));

	const hasNextPage = (page + 1) * per_page < responseData.totalElements;
	const nextPaginationToken = hasNextPage ? String(page + 1) : undefined;

	return { results, paginationToken: nextPaginationToken };
}
