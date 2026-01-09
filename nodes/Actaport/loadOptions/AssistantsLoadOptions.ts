import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { actaportApiRequestGetAllPaginatedItems } from '../GenericFunctions';

type AssistantLoadOption = {
	id: string;
	name: string;
};


export async function getAssistants(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const qs = { filter: "eq(assistenz,'true')", size: 50 };
	const assistants = (await actaportApiRequestGetAllPaginatedItems.call(
		this,
		'/benutzer',
		qs,
	)) as AssistantLoadOption[];

	if (assistants) {
		for (const assistant of assistants) {
			returnData.push({
				name: assistant.name,
				value: assistant.id,
			});
		}
	}

	return returnData;
}
