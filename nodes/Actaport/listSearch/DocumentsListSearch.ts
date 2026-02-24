import {
    ILoadOptionsFunctions,
    INodeListSearchItems,
    INodeListSearchResult,
    NodeApiError,
} from 'n8n-workflow';
import {actaportApiRequest} from '../GenericFunctions';
import {ValidationHelper} from '../helpers';

type DocumentSearchItem = {
    id: string;
    name: string;
};

type DocumentSearchResponse = {
    totalElements: number;
    content: DocumentSearchItem[];
};

export async function getDocuments(
    this: ILoadOptionsFunctions,
    filter?: string,
    paginationToken?: string,
): Promise<INodeListSearchResult> {
    const {laufendeNummer, bezugsJahr} = ValidationHelper.requireCaseFileSelector(
        this,
        'documents',
    );

    const page = paginationToken ? +paginationToken : 0;
    const per_page = 50;

    let responseData: DocumentSearchResponse = {
        content: [],
        totalElements: 0,
    };

    try {
        const qs = {page: page, size: per_page};

        if (filter) {
            Object.assign(qs, {filter: `contains(name,'${filter}')`});
        }

        responseData = (await actaportApiRequest.call(
            this,
            'GET',
            `/akten/${laufendeNummer}/${bezugsJahr}/dokumente/uebersicht`,
            {},
            qs,
            undefined,
        )) as DocumentSearchResponse;
    } catch (error) {
        throw new NodeApiError(this.getNode(), {
            message: 'Error while fetching documents',
            description: error instanceof Error ? error.message : 'Unknown error',
        });
    }

    const results: INodeListSearchItems[] = responseData.content.map((item: DocumentSearchItem) => ({
        name: item.name,
        value: item.id,
    }));

    const hasNextPage = (page + 1) * per_page < responseData.totalElements;
    const nextPaginationToken = hasNextPage ? String(page + 1) : undefined;

    return {results, paginationToken: nextPaginationToken};
}
