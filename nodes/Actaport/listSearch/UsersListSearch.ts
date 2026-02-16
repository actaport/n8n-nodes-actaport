import {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult, NodeApiError} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type UserSearchItem = {
	id: string;
	name: string;
};

type UserSearchResponse = {
	totalElements: number;
	content: UserSearchItem[];
};

export async function getUsers(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 0;
	const per_page = 25;

	let responseData: UserSearchResponse = {
		content: [],
		totalElements: 0,
	};

	try {
		responseData = (await actaportApiRequest.call(
			this,
			'GET',
			'/benutzer',
			{},
			{
				page: page,
				size: per_page,
			},
			undefined,
		)) as UserSearchResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: 'Error while fetching users',
			description: error instanceof Error ? error.message : 'Unknown error',
		});
	}

	const results: INodeListSearchItems[] = responseData.content.map((item: UserSearchItem) => ({
		name: item.name,
		value: item.id,
	}));

	const hasNextPage = (page + 1) * per_page < responseData.totalElements;
	const nextPaginationToken = hasNextPage ? String(page + 1) : undefined;

	return { results, paginationToken: nextPaginationToken };
}
