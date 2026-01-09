import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type DocumentLoadOptions = {
	id: string;
	name: string;
};

type DocumentLoadResponse = {
	dokumente?: DocumentLoadOptions[];
};

// Get documents that can be allocated by either expense or RVG fee.
export async function getAllocatableDocuments(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const laufendeNummer = asString(this.getNodeParameter('laufendeNummer', ''));
	const bezugsJahr = asString(this.getNodeParameter('bezugsJahr', ''));

	const returnData: INodePropertyOptions[] = [];

	if (!laufendeNummer || !bezugsJahr || bezugsJahr.length < 2) {
		// Avoid making API request if required parameters are missing or typing still in progress
		return returnData;
	}

	const qs = { filter: "eq(allocatableByAuslage,'true')" };
	const documents = (await actaportApiRequest.call(
		this,
		'GET',
		`/akten/${laufendeNummer}/${bezugsJahr}/dokumente`,
		undefined,
		qs,
		undefined,
	)) as DocumentLoadResponse;

	if (documents.dokumente) {
		for (const document of documents.dokumente) {
			returnData.push({
				name: document.name,
				value: document.id,
			});
		}
	}

	return returnData;
}

function asString(value: unknown): string {
	if (typeof value === 'string') return value.trim();
	if (typeof value === 'number') return String(value);
	return '';
}
