import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTask = {
	resource: ['task'],
};

const showCreate = {
	operation: ['create'],
	resource: ['task'],
};

const showUpdate = {
	operation: ['update'],
	resource: ['task'],
};

export const taskDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForTask },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create task',
				description: 'Create a new task',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/aufgaben',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get task',
				description: 'Retrieve a single task',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/aufgaben/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get tasks',
				description: 'Retrieve many tasks',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/aufgaben',
						arrayFormat: 'repeat',
					},
				},
			},

			{
				name: 'Update',
				value: 'update',
				action: 'Update task',
				description: 'Update an existing task',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/aufgaben/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update task status',
				description: 'Change the status of a task',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/aufgaben/{{$parameter["id"]}}/status/{{$parameter["status"]}}',
					},
				},
			},
		],
		default: 'getAll',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the task',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update', 'updateStatus', 'get'],
				resource: ['task'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		required: true,
		description: 'New status of the task',
		default: 'ERLEDIGT',
		type: 'options',
		options: [
			{
				name: 'OFFEN',
				value: 'OFFEN',
			},
			{
				name: 'ERLEDIGT',
				value: 'ERLEDIGT',
			},
			{
				name: 'ZU PRUEFEN',
				value: 'ZU_PRUEFEN',
			},
		],
		displayOptions: {
			show: {
				operation: ['updateStatus'],
				resource: ['task'],
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
				resource: ['task'],
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
				resource: ['task'],
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
				resource: ['task'],
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
				resource: ['task'],
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
		displayName: 'Title',
		name: 'titel',
		type: 'string',
		required: true,
		default: '',
		routing: {
			send: { type: 'body', property: 'titel' },
		},
		displayOptions: { show: { ...showCreate } },
	},
	{
		displayName: 'Due Date',
		name: 'faelligkeit',
		type: 'dateTime',
		required: true,
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'faelligkeit',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
		displayOptions: { show: { ...showCreate } },
	},
	{
		displayName: 'Prioritisation',
		name: 'priorisierung',
		type: 'options',
		required: true,
		default: 'VERFUEGUNG',
		options: [
			{ name: 'Verfügung', value: 'VERFUEGUNG' },
			{ name: 'Niedrig', value: 'NIEDRIG' },
			{ name: 'Neutral', value: 'NEUTRAL' },
			{ name: 'Hoch', value: 'HOCH' },
		],
		routing: {
			send: { type: 'body', property: 'priorisierung' },
		},
		displayOptions: { show: { ...showCreate } },
	},
	{
		displayName: 'Recipient',
		name: 'empfaenger',
		type: 'fixedCollection',
		required: true,
		typeOptions: { multipleValues: false },
		default: {},
		options: [
			{
				displayName: 'Recipient',
				name: 'empfaengerFields',
				values: [
					{
						displayName: 'ID',
						name: 'id',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						required: true,
						default: 'BENUTZER',
						options: [
							{ name: 'Benutzer', value: 'BENUTZER' },
							{ name: 'Gruppe', value: 'GROUP' },
						],
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'empfaenger',
				value: '={{ $value.empfaengerFields }}',
			},
		},
		displayOptions: { show: { ...showCreate } },
	},
	{
		displayName: 'Title',
		name: 'titel',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'titel',
				value: '={{ $value ?? undefined }}',
			},
		},
		displayOptions: { show: { ...showUpdate } },
	},
	{
		displayName: 'Due Date',
		name: 'faelligkeit',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'faelligkeit',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: { show: { ...showUpdate } },
	},
	{
		displayName: 'Prioritisation',
		name: 'priorisierung',
		type: 'options',
		default: 'VERFUEGUNG',
		options: [
			{ name: 'Verfügung', value: 'VERFUEGUNG' },
			{ name: 'Niedrig', value: 'NIEDRIG' },
			{ name: 'Neutral', value: 'NEUTRAL' },
			{ name: 'Hoch', value: 'HOCH' },
		],
		routing: {
			send: {
				type: 'body',
				property: 'priorisierung',
				value: '={{ $value ?? undefined }}',
			},
		},
		displayOptions: { show: { ...showUpdate } },
	},

	{
		displayName: 'Recipient',
		name: 'empfaenger',
		type: 'fixedCollection',
		default: {},
		typeOptions: { multipleValues: false },
		options: [
			{
				displayName: 'Recipient',
				name: 'empfaengerFields',
				values: [
					{ displayName: 'ID', name: 'id', type: 'string', default: '' },
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'BENUTZER',
						options: [
							{ name: 'Benutzer', value: 'BENUTZER' },
							{ name: 'Gruppe', value: 'GROUP' },
						],
					},
				],
			},
		],
		routing: {
			send: {
				type: 'body',
				property: 'empfaenger',
				value: '={{ $value.empfaengerFields ? $value.empfaengerFields : undefined }}',
			},
		},
		displayOptions: { show: { ...showUpdate } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		default: {},
		displayOptions: {
			show: {
				operation: ['create', 'update'],
				resource: ['task'],
			},
		},
		options: [
			{
				displayName: 'Case File',
				name: 'akte',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'Akte',
						name: 'akteFields',
						values: [
							{
								displayName: 'Aktennummer',
								name: 'aktennummer',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'akte',
						value: '={{ $value.akteFields ? $value.akteFields : undefined }}',
					},
				},
			},
			{
				displayName: 'Description',
				name: 'beschreibung',
				type: 'string',
				default: '',
				routing: {
					send: {
						type: 'body',
						property: 'beschreibung',
						value: '={{ $value ?? undefined }}',
					},
				},
			},
			{
				displayName: 'Documents',
				name: 'aktendokumente',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Document',
						name: 'docs',
						values: [
							{
								displayName: 'Document ID',
								name: 'id',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'aktendokumente',
						value: '={{ $value.docs ? $value.docs : undefined }}',
					},
				},
			},
			{
				displayName: 'For Review',
				name: 'zurPruefung',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						displayName: 'User',
						name: 'user',
						values: [
							{
								displayName: 'User ID',
								name: 'id',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'zurPruefung',
						value: '={{ $value.user ? $value.user : undefined }}',
					},
				},
			},
			{
				displayName: 'For Your Information',
				name: 'zurKenntnis',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'User',
						name: 'users',
						values: [
							{
								displayName: 'User ID',
								name: 'id',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'zurKenntnis',
						value: '={{ $value.users ? $value.users : undefined }}',
					},
				},
			},
			{
				displayName: 'Notes',
				name: 'notizen',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				default: {},
				options: [
					{
						displayName: 'Note',
						name: 'notes',
						values: [
							{
								displayName: 'Note ID',
								name: 'id',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						type: 'body',
						property: 'notizen',
						value: '={{ $value.notes ? $value.notes : undefined }}',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'OFFEN',
				options: [
					{ name: 'Offen', value: 'OFFEN' },
					{ name: 'Erledigt', value: 'ERLEDIGT' },
					{ name: 'Zu Prüfen', value: 'ZU_PRUEFEN' },
				],
				routing: {
					send: {
						type: 'body',
						property: 'status',
						value: '={{ $value ?? undefined }}',
					},
				},
			},
		],
	},
];
