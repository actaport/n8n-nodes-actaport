import {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult, NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { actaportApiRequest } from '../GenericFunctions';

type OrdnerResponse = {
	id: string;
	name: string;
	parentId?: string;
	system: boolean;
	children?: OrdnerResponse[];
};

export async function getFolders(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const laufendeNummer = this.getNodeParameter('laufendeNummer', 0) as string;
	const bezugsJahr = this.getNodeParameter('bezugsJahr', 0) as string;

	if (!laufendeNummer) {
		throw new NodeOperationError(
			this.getNode(),
			'Please fill in the Sequential Number in order to load folders.',
			{ level: 'warning' },
		);
	}

	if (!bezugsJahr) {
		throw new NodeOperationError(
			this.getNode(),
			'Please fill in the Reference Year in order to load folders.',
			{ level: 'warning' },
		);
	}

	let roots: OrdnerResponse[] = [];
	try {
		const response = (await actaportApiRequest.call(
			this,
			'GET',
			`/akten/${laufendeNummer}/${bezugsJahr}/ordner`,
		)) as OrdnerResponse[] | { content?: OrdnerResponse[] };

		roots = Array.isArray(response) ? response : (response.content ?? []);
	} catch (error) {
		throw new NodeApiError(this.getNode(), {
			message: 'Error while fetching folders',
			description: error instanceof Error ? error.message : 'Unknown error',
		});
	}

	const searchTerms = (filter ?? '')
		.toLowerCase()
		.split(' ')
		.filter((term) => term.trim() !== '');

	const hasFilter = searchTerms.length > 0;
	const results: INodeListSearchItems[] = [];
	const visited = new Set<string>();

	const sortFolders = (a: OrdnerResponse, b: OrdnerResponse) =>
		(a.name || '').localeCompare(b.name || '');

	const walk = (node: OrdnerResponse, parentPath: string, depth: number) => {
		if (!node?.id || visited.has(node.id)) return;
		visited.add(node.id);

		const fullPath = parentPath ? `${parentPath} > ${node.name}` : node.name;

		let displayName = '';

		if (hasFilter) {
			displayName = `${fullPath}`;
		} else {
			const indentation = depth > 0 ? '\u00A0\u00A0'.repeat(depth) + '↳ ' : '';
			displayName = `${indentation} ${node.name}`;
		}

		let isMatch = true;
		if (hasFilter) {
			isMatch = searchTerms.every((term) => fullPath.toLowerCase().includes(term));
		}

		if (isMatch) {
			results.push({
				name: displayName,
				value: node.id,
			});
		}

		const children = node.children ?? [];
		children.sort(sortFolders);

		for (const child of children) {
			walk(child, fullPath, depth + 1);
		}
	};

	roots.sort(sortFolders);
	for (const root of roots) {
		walk(root, '', 0);
	}

	return { results };
}
