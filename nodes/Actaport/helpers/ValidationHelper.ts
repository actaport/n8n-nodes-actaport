import type { IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export type EntityLabel = 'clients' | 'contacts' | 'tasks' | 'deadlines' | 'documents' | 'folders';
type N8nContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions;

export class ValidationHelper {
	static requireCaseFileSelector(
		ctx: N8nContext,
		entity: EntityLabel,
		index = 0,
	): { laufendeNummer: string; bezugsJahr: string } {
		const laufendeNummer = this.readStringParam(ctx, 'laufendeNummer', index);
		if (!laufendeNummer) {
			throw this.missingParameterError(ctx, 'Sequential Number', entity);
		}

		const bezugsJahr = this.readStringParam(ctx, 'bezugsJahr', index);
		if (!bezugsJahr) {
			throw this.missingParameterError(ctx, 'Reference Year', entity);
		}

		return { laufendeNummer, bezugsJahr };
	}

	private static readStringParam(ctx: N8nContext, name: string, index: number): string {
		const raw = ctx.getNodeParameter(name, index) as unknown;

		if (typeof raw === 'string') return raw.trim();
		if (raw === null || raw === undefined) return '';

		if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw).trim();

		return '';
	}

	private static missingParameterError(ctx: N8nContext, prettyParam: string, entity: EntityLabel): never {
		throw new NodeOperationError(
			ctx.getNode(),
			`Please fill in the ${prettyParam} in order to load ${entity}.`,
			{ level: 'warning' },
		);
	}
}
