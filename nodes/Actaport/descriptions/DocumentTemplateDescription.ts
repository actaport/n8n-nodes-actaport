import { INodeProperties } from 'n8n-workflow';

export const documentTemplateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['documentTemplate'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get document template',
				description: 'Get a single document template',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/vorlagen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get document templates',
				description: 'Retrieve many document templates',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/vorlagen',
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
				resource: ['documentTemplate'],
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
				resource: ['documentTemplate'],
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
				resource: ['documentTemplate'],
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
				resource: ['documentTemplate'],
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
				resource: ['documentTemplate'],
			},
		},
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the document template',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['get'],
				resource: ['documentTemplate'],
			},
		},
	},
];
