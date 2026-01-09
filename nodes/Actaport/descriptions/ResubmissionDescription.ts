import type { INodeProperties } from 'n8n-workflow';

const showOnlyForResubmission = {
	resource: ['resubmission'],
};

const showOnlyForResubmissionCreate = {
	operation: ['create'],
	resource: ['resubmission'],
};

const showOnlyForResubmissionUpdate = {
	operation: ['update'],
	resource: ['resubmission'],
};

export const resubmissionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForResubmission },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create resubmission',
				description: 'Create a new resubmission',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/wiedervorlagen',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get resubmission',
				description: 'Retrieve a single resubmission',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/wiedervorlagen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get resubmissions',
				description: 'Retrieve many resubmissions',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/wiedervorlagen',
						arrayFormat: 'repeat'
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update resubmission',
				description: 'Update an existing resubmission',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/wiedervorlagen/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Update Status',
				value: 'updateStatus',
				action: 'Update resubmission status',
				description: 'Change the status of a resubmission',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/wiedervorlagen/{{$parameter["id"]}}/status/{{$parameter["status"]}}',
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
				resource: ['resubmission'],
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
				resource: ['resubmission'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the resubmission',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['update', 'updateStatus', 'get'],
				resource: ['resubmission'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		required: true,
		description: 'New status of the resubmission',
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
		],
		displayOptions: {
			show: {
				operation: ['updateStatus'],
				resource: ['resubmission'],
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
				resource: ['resubmission'],
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
				resource: ['resubmission'],
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
				resource: ['resubmission'],
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
				resource: ['resubmission'],
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
		displayName: 'Reason',
		name: 'grund',
		type: 'string',
		required: true,
		default: '',
		routing: {
			send: { type: 'body', property: 'grund' },
		},
		displayOptions: { show: { ...showOnlyForResubmissionCreate } },
	},
	{
		displayName: 'Submission Date',
		name: 'vorlagedatum',
		type: 'dateTime',
		required: true,
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'vorlagedatum',
				value: '={{ new Date($value).toISOString() }}',
			},
		},
		displayOptions: { show: { ...showOnlyForResubmissionCreate } },
	},
	{
		displayName: 'Comment',
		name: 'anmerkung',
		type: 'string',
		default: '',
		routing: {
			send: { type: 'body', property: 'anmerkung' },
		},
		displayOptions: { show: { ...showOnlyForResubmissionCreate } },
	},
	{
		displayName: 'Reason',
		name: 'grund',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'grund',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: { show: { ...showOnlyForResubmissionUpdate } },
	},
	{
		displayName: 'Submission Date',
		name: 'vorlagedatum',
		type: 'dateTime',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'vorlagedatum',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: { show: { ...showOnlyForResubmissionUpdate } },
	},
	{
		displayName: 'Comment',
		name: 'anmerkung',
		type: 'string',
		default: '',
		routing: {
			send: {
				type: 'body',
				property: 'anmerkung',
				value: '={{ $value ?? undefined }}',
			},
		},
		displayOptions: { show: { ...showOnlyForResubmissionUpdate } },
	},
];
