import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { actaportApiRequestGetAllPaginatedItems } from '../GenericFunctions';

type CostCenterLoadOption = {
	id: string;
	anzeigename: string;
	kostenstellennummer: string;
};

export async function getCostCenters(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const returnData: INodePropertyOptions[] = [];
	const qs = { size: 500 };
	const costCenters = (await actaportApiRequestGetAllPaginatedItems.call(
		this,
		'/kostenstellen',
		qs,
	)) as CostCenterLoadOption[];

	if (costCenters) {
		for (const costCenter of costCenters) {
			returnData.push({
				name: costCenter.anzeigename,
				value: `${costCenter.id}::${costCenter.kostenstellennummer}`,
			});
		}
	}

	return returnData;
}
