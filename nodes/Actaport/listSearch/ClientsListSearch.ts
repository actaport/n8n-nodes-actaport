import {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
	NodeOperationError,
} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

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

	const laufendeNummer = this.getNodeParameter('laufendeNummer', 0) as string;
	const bezugsJahr = this.getNodeParameter('bezugsJahr', 0) as string;

	if (!laufendeNummer) {
		throw new NodeOperationError(
			this.getNode(),
			'Please fill in the Laufende Nummer before searching for clients.',
			{ level: 'warning' },
		);
	}

	if (!bezugsJahr) {
		throw new NodeOperationError(
			this.getNode(),
			'Please fill in the Bezugsjahr before loading clients.',
			{ level: 'warning' },
		);
	}

	try {
		responseData = (await actaportApiRequest.call(
			this,
			'GET',
			`/akten/${laufendeNummer}/${bezugsJahr}/honorar`,
		)) as ClientSearchResponse;
	} catch (error) {
		this.logger?.warn('Error fetching clients: ' + (error as Error).message);
	}

	const mandantenArray = Object.values(responseData.mandanten ?? {});

	const results: INodeListSearchItems[] = mandantenArray.map((item: ClientSearchItem) => ({
		name: item.anzeigename,
		value: item.id,
	}));

	return { results, paginationToken: undefined };
}
