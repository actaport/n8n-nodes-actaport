import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import {
    getUsers,
    getClients,
    getContacts,
    getDocumentTemplates,
    getFolders,
    getOfficeLocations,
    getDocuments
} from './listSearch';
import {getAllocatableDocuments, getClerks, getAssistants, getDepartments} from './loadOptions';
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
    documentTemplateDescription,
    departmentDescription
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
                        name: 'Department',
                        value: 'department',
                    },
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Document Template',
						value: 'documentTemplate',
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
            ...departmentDescription,
			...documentDescription,
			...documentTemplateDescription,
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
			getDocumentTemplates,
			getFolders,
			getOfficeLocations,
			getDocuments
		},
		loadOptions: {
			getAllocatableDocuments,
			getClerks,
			getAssistants,
            getDepartments,
		},
	};
}

