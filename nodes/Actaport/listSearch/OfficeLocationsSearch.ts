import {ILoadOptionsFunctions, INodeListSearchItems, INodeListSearchResult, NodeApiError} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type OfficeLocationSearchItem = {
	id: string;
	name?: string;
	ort?: string;
};

type OfficeInformationResponse = {
	standorte?: OfficeLocationSearchItem[];
};

export async function getOfficeLocations(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	let locations: OfficeLocationSearchItem[] = [];

	try {
		const response = (await actaportApiRequest.call(
			this,
			'GET',
			'/info/kanzlei',
		)) as OfficeInformationResponse;

		locations = response.standorte ?? [];
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: 'Error while fetching office locations',
			description: error instanceof Error ? error.message : 'Unknown error',
		});
	}

	const results: INodeListSearchItems[] = locations.map((item) => {
		const displayName = item.name || 'Unknown office location';
		const citySuffix = item.ort ? ` (${item.ort})` : '';

		return {
			name: `${displayName}${citySuffix}`,
			value: item.id,
		};
	});

	return { results };
}
