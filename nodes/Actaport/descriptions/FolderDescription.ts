import type { INodeProperties } from 'n8n-workflow';

export const folderDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['folder'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create folder',
				description: 'Create a new folder in a case file',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/ordner',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get folder',
				description: 'Get a single folder',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/ordner/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get folders',
				description: 'Retrieve folder structure of a case file',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/ordner',
						arrayFormat: 'repeat',
						qs: {
							size: "={{ $parameter['returnAll'] ? 50 : $parameter['size'] }}",
						},
					},
					send: {
						paginate: "={{ $parameter['returnAll'] }}",
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'content',
								},
							},
						],
					},
					operations: {
						pagination: {
							type: 'generic',
							properties: {
								continue: '={{ !$response.body?.last }}',
								request: {
									qs: {
										page: '={{ ($response.body?.number ?? -1) + 1 }}',
										size: '={{ $response.body?.size ?? 50 }}',
										filter: '={{ $request.qs?.filter }}',
										sort: '={{ $request.qs?.sort }}',
									},
								},
							},
						},
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['folder'],
			},
		},
	},
	{
		displayName: 'Sequential Number',
		name: 'laufendeNummer',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['create', 'get', 'getAll'],
				resource: ['folder'],
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
				operation: ['create', 'get', 'getAll'],
				resource: ['folder'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the folder',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['folder'],
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
				resource: ['folder'],
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
		description: 'Name of the folder to create',
		required: true,
		validateType: 'string',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['folder'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'name',
			},
		},
	},
	{
		displayName: 'Parent Folder',
		name: 'parentFolderId',
		description:
			'Parent folder ID of the folder. If not set, the folder will be created at the root level.',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['folder'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getFolders',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Folder ID',
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'parentId',
				value: "={{ $value && $value !==  '' ? $value : undefined }}",
			},
		},
	},
];
