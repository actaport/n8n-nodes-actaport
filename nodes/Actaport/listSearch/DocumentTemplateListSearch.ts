import {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
	NodeApiError,
} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type DocumentTemplateSearchItem = {
	id: string;
	name: string;
};

type DocumentTemplateSearchResponse = {
	totalElements: number;
	content: DocumentTemplateSearchItem[];
};

export async function getDocumentTemplates(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 0;
	const per_page = 20;

	let responseData: DocumentTemplateSearchResponse = {
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
			'/vorlagen',
			{},
			qs,
			undefined,
		)) as DocumentTemplateSearchResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), { message: 'Error fetching document templates', error });
	}

	const results: INodeListSearchItems[] = responseData.content.map(
		(item: DocumentTemplateSearchItem) => ({
			name: item.name,
			value: item.id,
		}),
	);

	const hasNextPage = (page + 1) * per_page < responseData.totalElements;
	const nextPaginationToken = hasNextPage ? String(page + 1) : undefined;

	return { results, paginationToken: nextPaginationToken };
}
