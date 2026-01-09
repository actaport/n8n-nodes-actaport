import type { INodeProperties } from 'n8n-workflow';
const showOnlyForUsers = {
	resource: ['user'],
};

const showOnlyForUserGet = {
	operation: ['get'],
	resource: ['user'],
};

const showOnlyForUserGetAll = { operation: ['getAll'], resource: ['user'] };

export const userDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForUsers,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a user',
				description: 'Get the data of a single user',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/benutzer/{{$parameter.userId}}',
					},
				},
			},
			{
				name: 'Get Me',
				value: 'getCurrent',
				action: 'Get me',
				description: 'Get the data of the current authenticated user',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/info/me',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many users',
				description: 'Get the data of multiple users',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/benutzer',
						arrayFormat: 'repeat',
					},
				},
			},
		],
		default: 'getCurrent',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		displayOptions: { show: showOnlyForUserGet },
		default: '',
		description: 'The ID of the user to retrieve',
		required: true,
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
				...showOnlyForUserGetAll,
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
				...showOnlyForUserGetAll,
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
				...showOnlyForUserGetAll,
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
				resource: ['user'],
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
];
