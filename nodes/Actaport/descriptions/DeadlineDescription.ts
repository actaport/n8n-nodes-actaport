import type { INodeProperties } from 'n8n-workflow';

export const deadlineDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['deadline'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create deadline',
				description: 'Create a new deadline',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/fristen',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get deadline',
				description: 'Retrieve a single deadline',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/fristen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get deadlines',
				description: 'Retrieve many deadlines',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fristen',
						arrayFormat: 'repeat',
						qs: {
							size: "={{ $parameter['returnAll'] ? 100 : $parameter['size'] }}",
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
										size: '={{ $response.body?.size ?? 100 }}',
										filter: '={{ $request.qs?.filter }}',
										sort: '={{ $request.qs?.sort }}',
									},
								},
							},
						},
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update deadline',
				description: 'Update an existing deadline',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/fristen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update deadline status',
				description: 'Change the status of a deadline',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/fristen/{{$parameter["id"]}}/status/{{$parameter["status"]}}',
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
				operation: ['create', 'update', 'updateStatus', 'get'],
				resource: ['deadline'],
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
				operation: ['create', 'update', 'updateStatus', 'get'],
				resource: ['deadline'],
			},
		},
		default: '',
		description: 'Reference year of the case',
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
				resource: ['deadline'],
				returnAll: [false],
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
				resource: ['deadline'],
				returnAll: [false],
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
				resource: ['deadline'],
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
				resource: ['deadline'],
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
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the deadline',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get', 'update', 'updateStatus'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		required: true,
		description: 'New status of the deadline',
		default: 'ERLEDIGT',
		type: 'options',
		options: [
			{
				name: 'Open',
				value: 'OFFEN',
			},
			{
				name: 'To Be Approved',
				value: 'ZUGENEHMIGEN',
			},
			{
				name: 'Preliminary Completed',
				value: 'VORFRIST_ERLEDIGT',
			},
			{
				name: 'Completed',
				value: 'ERLEDIGT',
			},
		],
		displayOptions: {
			show: {
				operation: ['updateStatus'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Note',
		name: 'anmerkung',
		type: 'string',
		default: '',
		description: 'Note for the deadline',
		routing: {
			send: {
				property: 'anmerkung',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Note',
		name: 'anmerkung',
		type: 'string',
		default: '',
		description: 'Note for the deadline',
		routing: {
			send: {
				property: 'anmerkung',
				type: 'body',
				value: '={{ $value === "" ? undefined : $value }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['update'],
			},
		},
	},
	{
		displayName: 'Start of Deadline',
		name: 'fristbeginn',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				property: 'fristbeginn',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'End of Deadline',
		required: true,
		name: 'fristende',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				property: 'fristende',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'End of Deadline',
		name: 'fristende',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				property: 'fristende',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Reason',
		required: true,
		name: 'fristgrund',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'fristgrund',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Reason',
		name: 'fristgrund',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'fristgrund',
				type: 'body',
				value: '={{ $value === "" ? undefined : $value }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Final Deadline',
		name: 'notfrist',
		type: 'boolean',
		default: false,
		description: 'Whether it is a final deadline',
		routing: {
			send: {
				property: 'notfrist',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Final Deadline',
		name: 'notfrist',
		type: 'options',
		default: '',
		options: [
			{ name: 'Do Not Change', value: '' },
			{ name: 'Yes', value: true },
			{ name: 'No', value: false },
		],
		routing: {
			send: {
				type: 'body',
				property: 'notfrist',
				value: "={{ $parameter.notfrist === '' ? undefined : $parameter.notfrist }}",
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Preliminary Deadline',
		name: 'vorfrist',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				property: 'vorfrist',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Provisional',
		name: 'vorlaeufig',
		type: 'boolean',
		default: false,
		description: 'Whether the deadline is provisional',
		routing: {
			send: {
				property: 'vorlaeufig',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Provisional',
		name: 'vorlaeufig',
		type: 'options',
		default: '',
		options: [
			{ name: 'Do Not Change', value: '' },
			{ name: 'Yes', value: true },
			{ name: 'No', value: false },
		],
		routing: {
			send: {
				type: 'body',
				property: 'vorlaeufig',
				value: "={{ $parameter.vorlaeufig === '' ? undefined : $parameter.vorlaeufig }}",
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Remove Document',
		name: 'removeDocument',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['deadline'],
			},
		},
		routing: {
			send: {
				property: 'aktendokument',
				type: 'body',
				value: '={{ $value ? null : undefined }}',
			},
		},
	},
	{
		displayName: 'Document',
		name: 'documentId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				resource: ['deadline'],
			},
			hide: {
				removeDocument: [true],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getDocuments',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Document ID',
			},
		],
		routing: {
			send: {
				property: 'aktendokument',
				type: 'body',
				value: '={{ $value && $value !== "" ? { id: $value } : undefined }}',
			},
		},
	},
];
