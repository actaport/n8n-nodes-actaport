import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { actaportApiRequestGetAllPaginatedItems } from '../GenericFunctions';

type ClerkLoadOption = {
	id: string;
	name: string;
};


export async function getClerks(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const qs = { filter: "eq(sachbearbeiter,'true')", size: 50 };
	const clerks = (await actaportApiRequestGetAllPaginatedItems.call(
		this,
		'/benutzer',
		qs,
	)) as ClerkLoadOption[];

	if (clerks) {
		for (const clerk of clerks) {
			returnData.push({
				name: clerk.name,
				value: clerk.id,
			});
		}
	}

	return returnData;
}
