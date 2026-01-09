import type { INodeProperties } from 'n8n-workflow';

export const collisionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['collision'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get collision check',
				description: 'Check for collisions',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/kollisionspruefung',
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Last Name',
		name: 'name',
		required: true,
		default: '',
		type: 'string',
		routing: {
			send: {
				type: 'query',
				property: 'name',
			},
		},
		displayOptions: {
			show: {
				resource: ['collision'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'vorname',
		required: true,
		default: '',
		type: 'string',
		routing: {
			send: {
				type: 'query',
				property: 'vorname',
				value: '={{ $value }}',
				propertyInDotNotation: false,
			},
		},
		displayOptions: {
			show: {
				resource: ['collision'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Main Role',
		name: 'rolle',
		required: true,
		description: 'Main role of the contact in the collision check',
		default: '',
		type: 'string',
		routing: {
			send: {
				type: 'query',
				property: 'rolle',
			},
		},
		displayOptions: {
			show: {
				resource: ['collision'],
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add field',
		displayOptions: {
			show: {
				resource: ['collision'],
				operation: ['get'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Birth Date',
				name: 'geburtsdatum',
				default: '',
				type: 'dateTime',
				routing: {
					send: {
						type: 'query',
						property: 'geburtsdatum',
						value: '={{ $value ? $value.split("T")[0] : undefined }}',
						propertyInDotNotation: false,
					},
				},
			},
			{
				displayName: 'City',
				name: 'ort',
				default: '',
				type: 'string',
				routing: {
					send: {
						type: 'query',
						property: 'ort',
					},
				},
			},
			{
				displayName: 'House Number',
				name: 'hausnummer',
				default: '',
				type: 'string',
				routing: {
					send: {
						type: 'query',
						property: 'hausnummer',
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Street',
				name: 'strasse',
				default: '',
				type: 'string',
				routing: {
					send: {
						type: 'query',
						property: 'strasse',
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Zip Code',
				name: 'plz',
				default: '',
				type: 'string',
				routing: {
					send: {
						type: 'query',
						property: 'plz',
					},
				},
			},
		],
	},
];
