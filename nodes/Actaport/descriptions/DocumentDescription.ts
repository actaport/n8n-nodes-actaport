import { INodeProperties } from 'n8n-workflow';
import { preSendUpload } from '../helpers/DocumentUploadHelper';

const showOnlyForDocument = {
	resource: ['document'],
};

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocument },
		options: [
			{
				name: 'Download',
				value: 'download',
				action: 'Download document',
				description: 'Download a single document',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/documents/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get document',
				description: 'Get a single document',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/dokumente/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get documents',
				description: 'Retrieve many documents',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/dokumente/uebersicht',
						arrayFormat: 'repeat',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update document',
				description: 'Update a single document',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/documents/{{$parameter["id"]}}/metadata',
					},
				},
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload document',
				description: 'Upload a document to a case',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter.laufendeNummer}}/{{$parameter.bezugsJahr}}/dokumente',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
					send: {
						preSend: [preSendUpload],
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Sequential Number',
		name: 'laufendeNummer',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['get', 'getAll', 'upload'],
				resource: ['document'],
			},
		},
		default: '',
		description: 'Sequential Number of the case',
	},
	{
		displayName: 'Reference Year',
		name: 'bezugsJahr',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				operation: ['get', 'getAll', 'upload'],
				resource: ['document'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the document',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['download', 'get', 'update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		description: 'Page index starting from 0 (0..N)',
		default: 0,
		type: 'number',
		routing: {
			send: {
				type: 'query',
				property: 'page',
			},
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'size',
		description: 'The size of the page to return',
		default: 20,
		type: 'number',
		routing: {
			send: {
				type: 'query',
				property: 'size',
			},
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['document'],
			},
		},
		placeholder: 'Add Filter',
		options: [
			{
				name: 'filter',
				displayName: 'Filter',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'query',
				property: 'filter',
				value:
					'={{ Array.isArray($value?.filter) ' +
					'? $value.filter' +
					"    .filter(f => f.field && f.operator && f.value !== '')" +
					"    .map(f => `${f.operator}(${f.field},'${f.value}')`)" +
					' : undefined }}',
			},
		},
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['document'],
			},
		},
		placeholder: 'Add Sort Field',
		options: [
			{
				name: 'criterion',
				displayName: 'Sort Criterion',
				values: [
					{
						displayName: 'Field',
						name: 'field',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Direction',
						description: 'Sort direction: asc or desc',
						name: 'direction',
						type: 'string',
						default: '',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'query',
				property: 'sort',
				value:
					'={{ Array.isArray($value?.criterion) ' +
					'? $value.criterion' +
					'    .filter(s => s.field && s.direction)' +
					'    .map(s => `${s.field},${s.direction}`)' +
					' : undefined }}',
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the document',
		routing: {
			send: {
				property: 'name',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the document',
		routing: {
			send: {
				property: 'beschreibung',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		description: 'Type of the document',
		routing: {
			send: {
				property: 'typ',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'string',
		default: '',
		description: 'Status of the document',
		routing: {
			send: {
				property: 'status',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Created At (Modified)',
		name: 'createdAtModified',
		type: 'dateTime',
		default: '',
		description: 'Creation date of the document (modification date will be set)',
		routing: {
			send: {
				property: 'erzeugtAmModifiziert',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		required: true,
		type: 'string',
		typeOptions: {
			binaryDataProperty: true,
		},
		default: 'data',
		description: 'Name of the binary property which contains the document data',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Document Name',
				name: 'documentName',
				type: 'string',
				default: '',
				description:
					'Name of the document to upload. If not specified, the original file name will be used.',
			},
			{
				displayName: 'Folder Name',
				name: 'folderName',
				type: 'string',
				default: '',
				description:
					'Name of the folder to upload the document into. If not specified, the document will be uploaded to the default folder.',
			},
		],
	},
];
