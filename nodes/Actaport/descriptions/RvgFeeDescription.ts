import type { INodeProperties } from 'n8n-workflow';

export const rvgFeeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['rvg'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create rvg fee',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/rvg',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete rvg fee',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/rvg/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get rvg fee',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/rvg/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get rvg fees',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/rvg',
						arrayFormat: 'repeat',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update rvg fee',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/rvg/{{$parameter["id"]}}',
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
				operation: ['create', 'delete', 'get', 'getAll', 'update'],
				resource: ['rvg'],
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
				operation: ['create', 'delete', 'get', 'getAll', 'update'],
				resource: ['rvg'],
			},
		},
		default: 0,
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the RVG fee',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete', 'get', 'update'],
				resource: ['rvg'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		description: 'Page index starting from 0 (0..N)',
		default: 0,
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		routing: {
			send: {
				type: 'query',
				property: 'page',
			},
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['rvg'],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'size',
		description: 'The size of the page to return',
		default: 20,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		routing: {
			send: {
				type: 'query',
				property: 'size',
			},
		},
		displayOptions: {
			show: {
				operation: ['getAll'],
				resource: ['rvg'],
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
				resource: ['rvg'],
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
						description: 'Name of the field to filter',
					},
					{
						displayName: 'Operator',
						name: 'operator',
						type: 'string',
						default: '',
						description: "Filter operator, e.g., 'eq', 'ne', 'lt', 'gt'",
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to compare against',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'query',
				property: 'filter',
				value:
					'={{Array.isArray($value?.filter) ' +
					'? $value.filter' +
					"    .filter(f => f.field && f.operator && f.value !== '')" +
					'    .map(f => `${f.operator}(${f.field},\'${String(f.value).replace(/\'/g, "%27")})`)' +
					' : undefined}}',
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
				resource: ['rvg'],
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
						description: 'Field to sort by',
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
					'={{Array.isArray($value?.criterion) ' +
					'? $value.criterion' +
					'    .filter(s => s.field && s.direction)' +
					'    .map(s => `${s.field},${s.direction}`)' +
					' : undefined}}',
			},
		},
	},
	{
		displayName: 'Activity Type',
		required: true,
		name: 'activity',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'taetigkeit',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['rvg'],
			},
		},
	},
	{
		displayName: 'VAT Rate',
		required: true,
		name: 'vatRate',
		type: 'number',
		default: 0.19,
		routing: {
			send: {
				property: 'umsatzsteuer',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['rvg'],
			},
		},
	},
	{
		displayName: 'Line Items',
		name: 'positionen',
		type: 'fixedCollection',
		default: {
			position: [
				{
					beschreibung: '',
					nettobetrag: 0,
					vvnr: '',
				},
			],
		},
		typeOptions: {
			multipleValues: true,
			minValues: 1,
			multipleValueButtonText: 'Add Line Item',
		},
		options: [
			{
				displayName: 'Line Item',
				name: 'position',
				values: [
					{
						displayName: 'Description',
						name: 'beschreibung',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Net Amount (in Cent)',
						name: 'nettobetrag',
						type: 'number',
						required: true,
						default: 0,
					},
					{
						displayName: 'Renumeration Number',
						name: 'vvnr',
						type: 'string',
						required: true,
						default: '',
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'positionen',
				value: '={{ Array.isArray($value.position) ? $value.position : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['rvg'],
			},
		},
	},
	{
		displayName: 'User',
		name: 'benutzerId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		required: true,
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
			{
				displayName: 'User',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: false,
					searchFilterRequired: false,
				},
			},
		],
		routing: {
			send: {
				property: 'benutzer',
				type: 'body',
				value: '={{ $value ? { id: $value } : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['rvg'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'User',
		name: 'benutzerIdUpdate',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
			{
				displayName: 'User',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getUsers',
					searchable: false,
					searchFilterRequired: false,
				},
			},
		],
		routing: {
			send: {
				property: 'benutzer',
				type: 'body',
				value: '={{ $value ? { id: $value } : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['rvg'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Client',
		name: 'clientId',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
			{
				displayName: 'Client',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getClients',
					searchable: false,
					searchFilterRequired: false,
				},
			},
		],
		routing: {
			send: {
				property: 'mandant',
				type: 'body',
				value: '={{ $value ? { id: $value } : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['rvg'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Client',
		name: 'clientIdUpdate',
		type: 'resourceLocator',
		default: { mode: 'id', value: '' },
		modes: [
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
			},
			{
				displayName: 'Client',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getClients',
					searchable: false,
					searchFilterRequired: false,
				},
			},
		],
		routing: {
			send: {
				property: 'mandant',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? { id: $value } : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['rvg'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Case File Number',
		name: 'caseFileNumber',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'aktennummer',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['rvg'],
			},
		},
	},
];
