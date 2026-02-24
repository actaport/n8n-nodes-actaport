import { ILoadOptionsFunctions, INodePropertyOptions } from 'n8n-workflow';
import { actaportApiRequestGetAllPaginatedItems } from '../GenericFunctions';

type DepartmentLoadOption = {
    id: string;
    anzeigename: string;
};


export async function getDepartments(
    this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
    const returnData: INodePropertyOptions[] = [];
    const qs = { size: 100 };
    const departments = (await actaportApiRequestGetAllPaginatedItems.call(
        this,
        '/info/kanzlei/dezernate',
        qs,
    )) as DepartmentLoadOption[];

    if (departments) {
        for (const department of departments) {
            returnData.push({
                name: department.anzeigename,
                value: department.id,
            });
        }
    }

    return returnData;
}
