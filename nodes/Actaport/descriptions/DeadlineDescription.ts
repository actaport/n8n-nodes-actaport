import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeadline = {
	resource: ['deadline'],
};

const showOnlyForDeadlineCreate = { operation: ['create'], resource: ['deadline'] };

export const deadlineDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDeadline },
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
				name: 'Get Many',
				value: 'getAll',
				action: 'Get deadlines',
				description: 'Retrieve many deadlines',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/fristen',
						arrayFormat: 'repeat'
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
				operation: ['create', 'updateStatus', 'get'],
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
				operation: ['create', 'updateStatus', 'get'],
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
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the deadline',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['updateStatus', 'get'],
				resource: ['deadline'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		required: true,
		description: 'Neuer Status der Deadline',
		default: 'ERLEDIGT',
		type: 'options',
		options: [
			{
				name: 'OFFEN',
				value: 'OFFEN',
			},
			{
				name: 'ZUGENEHMIGEN',
				value: 'ZUGENEHMIGEN',
			},
			{
				name: 'VORFRIST ERLEDIGT',
				value: 'VORFRIST_ERLEDIGT',
			},
			{
				name: 'ERLEDIGT',
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
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
				...showOnlyForDeadlineCreate,
			},
		},
	},
];
