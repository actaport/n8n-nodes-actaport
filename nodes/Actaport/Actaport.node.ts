import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getUsers, getClients, getContacts } from './listSearch';
import { getAllocatableDocuments, getClerks, getAssistants } from './loadOptions';
import {
	additionalInformationCategoryDescription,
	noteDescription,
	rvgFeeDescription,
	expenseDescription,
	documentDescription,
	thirdPartyCostDescription,
	userDescription,
	collisionDescription,
	invoiceDescription,
	resubmissionDescription,
	deadlineDescription,
	taskDescription,
	caseFileDescription,
	contactDescription,
	folderDescription,
} from './descriptions';

export class Actaport implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Actaport',
		name: 'actaport',
		icon: { light: 'file:actaport.light.svg', dark: 'file:actaport.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Actaport API',
		defaults: {
			name: 'Actaport',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'actaportOAuth2Api', required: true }],
		requestDefaults: {
			baseURL: 'https://app.actaport.de',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Additional Information Category',
						value: 'additionalInformationCategory',
					},
					{
						name: 'Case File',
						value: 'caseFile',
					},
					{
						name: 'Collision',
						value: 'collision',
					},
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Deadline',
						value: 'deadline',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Expense',
						value: 'expense',
					},
					{
						name: 'Folder',
						value: 'folder',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Note',
						value: 'note',
					},
					{
						name: 'Resubmission',
						value: 'resubmission',
					},
					{
						name: 'RVG Fee',
						value: 'rvg',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Third Party Cost',
						value: 'thirdPartyCost',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'contact',
			},
			...additionalInformationCategoryDescription,
			...caseFileDescription,
			...collisionDescription,
			...contactDescription,
			...deadlineDescription,
			...documentDescription,
			...expenseDescription,
			...folderDescription,
			...invoiceDescription,
			...noteDescription,
			...resubmissionDescription,
			...rvgFeeDescription,
			...taskDescription,
			...thirdPartyCostDescription,
			...userDescription,
		],
	};

	methods = {
		listSearch: {
			getUsers,
			getClients,
			getContacts,
		},
		loadOptions: {
			getAllocatableDocuments,
			getClerks,
			getAssistants,
		},
	};
}
