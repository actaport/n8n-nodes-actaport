import {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult, NodeApiError
} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';
import {ValidationHelper} from "../helpers";

type ClientSearchItem = {
	id: string | number;
	anzeigename: string;
};

type ClientSearchResponse = {
	mandanten: Record<string, ClientSearchItem>;
};

export async function getClients(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	let responseData: ClientSearchResponse = {
		mandanten: {},
	};

	const { laufendeNummer, bezugsJahr } = ValidationHelper.requireCaseFileSelector(this, 'clients');

	try {
		responseData = (await actaportApiRequest.call(
			this,
			'GET',
			`/akten/${laufendeNummer}/${bezugsJahr}/honorar`,
		)) as ClientSearchResponse;
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: 'Error while fetching clients of case ' + laufendeNummer + ' for year ' + bezugsJahr,
			description: error instanceof Error ? error.message : 'Unknown error',
		});
	}

	const mandantenArray = Object.values(responseData.mandanten ?? {});

	const results: INodeListSearchItems[] = mandantenArray.map((item: ClientSearchItem) => ({
		name: item.anzeigename,
		value: item.id,
	}));

	return { results, paginationToken: undefined };
}
