import type { INodeProperties } from 'n8n-workflow';

export const expenseDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['expense'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create expense',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/eigene-auslagen',
					},
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete expense',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/eigene-auslagen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get expense',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/eigene-auslagen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get expenses',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/eigene-auslagen',
						arrayFormat: 'repeat',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update expense',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/verguetungspositionen/eigene-auslagen/{{$parameter["id"]}}',
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
				resource: ['expense'],
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
				resource: ['expense'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the expense',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['delete', 'get', 'update'],
				resource: ['expense'],
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
				resource: ['expense'],
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
				resource: ['expense'],
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
				resource: ['expense'],
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
				resource: ['expense'],
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
		displayName: 'Reason (Grundlage)',
		name: 'grundlage',
		type: 'string',
		required: true,
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'grundlage',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Reason (Grundlage)',
		name: 'grundlageUpdate',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'grundlage',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Expenditure Type (Art)',
		name: 'art',
		type: 'string',
		required: true,
		default: '',
		routing: {
			send: {
				property: 'art',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Expenditure Type (Art)',
		name: 'artUpdate',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'art',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Comment',
		name: 'bemerkung',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'bemerkung',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Comment',
		name: 'bemerkungUpdate',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'bemerkung',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Expense Type',
		name: 'typ',
		type: 'options',
		default: 'AUFWENDUNG',
		required: true,
		options: [
			{ name: 'Aufwendung', value: 'AUFWENDUNG' },
			{ name: 'Fremdleistung Inland', value: 'FREMDLEISTUNG_INLAND' },
			{ name: 'Fremdleistung Ausland', value: 'FREMDLEISTUNG_AUSLAND' },
			{ name: 'Fremdleistung EU', value: 'FREMDLEISTUNG_EU' },
		],
		routing: {
			send: {
				type: 'body',
				property: 'typ',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Expense Type',
		name: 'typUpdate',
		type: 'options',
		default: 'AUFWENDUNG',
		options: [
			{ name: 'Aufwendung', value: 'AUFWENDUNG' },
			{ name: 'Fremdleistung Inland', value: 'FREMDLEISTUNG_INLAND' },
			{ name: 'Fremdleistung Ausland', value: 'FREMDLEISTUNG_AUSLAND' },
			{ name: 'Fremdleistung EU', value: 'FREMDLEISTUNG_EU' },
		],
		routing: {
			send: {
				type: 'body',
				property: 'typ',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'VAT Rate',
		name: 'umsatzsteuer',
		type: 'number',
		required: true,
		default: 0.19,
		routing: {
			send: {
				property: 'umsatzsteuer',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'VAT Rate',
		name: 'umsatzsteuerUpdate',
		type: 'number',
		default: null,
		routing: {
			send: {
				property: 'umsatzsteuer',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Net Amount (Cent)',
		name: 'netto',
		type: 'number',
		required: true,
		default: null,
		routing: {
			send: {
				property: 'netto',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Net Amount (Cent)',
		name: 'nettoUpdate',
		type: 'number',
		default: null,
		routing: {
			send: {
				property: 'netto',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Gross Amount (Cent)',
		name: 'brutto',
		type: 'number',
		default: null,
		routing: {
			send: {
				property: 'brutto',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Gross Amount (Cent)',
		name: 'bruttoUpdate',
		type: 'number',
		default: null,
		routing: {
			send: {
				property: 'brutto',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'anzahl',
		type: 'number',
		required: true,
		default: 1,
		routing: {
			send: {
				property: 'anzahl',
				type: 'body',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Quantity',
		name: 'anzahlUpdate',
		type: 'number',
		default: null,
		routing: {
			send: {
				property: 'anzahl',
				type: 'body',
				value: '={{ $value !== null && $value !== "" ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Date',
		name: 'datum',
		type: 'dateTime',
		required: true,
		default: '',
		routing: {
			send: {
				property: 'datum',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Date',
		name: 'datumUpdate',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				property: 'datum',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['update'],
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
				resource: ['expense'],
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
				resource: ['expense'],
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
				resource: ['expense'],
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
				resource: ['expense'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Linked Case Documents',
		name: 'aktendokumente',
		type: 'multiOptions',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getAllocatableDocuments',
			loadOptionsDependsOn: ['laufendeNummer', 'bezugsJahr'],
		},
		routing: {
			send: {
				type: 'body',
				property: 'aktendokumente',
				value: '={{ $value ? $value.map(id => ({ id })) : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Linked Case Documents',
		name: 'aktendokumenteUpdate',
		type: 'multiOptions',
		description:
			'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		default: [],
		typeOptions: {
			loadOptionsMethod: 'getAllocatableDocuments',
			loadOptionsDependsOn: ['laufendeNummer', 'bezugsJahr'],
		},
		routing: {
			send: {
				type: 'body',
				property: 'aktendokumente',
				value: '={{ $value ? $value.map(id => ({ id })) : undefined }}',
			},
		},
		displayOptions: {
			show: {
				resource: ['expense'],
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
				resource: ['expense'],
			},
		},
	},
];
