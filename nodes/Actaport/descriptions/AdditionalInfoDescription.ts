import { INodeProperties } from 'n8n-workflow';

export const additionalInformationCategoryDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['additionalInformationCategory'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get additional information category',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/zusatzinformation/kategorien/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get additional information categories',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/zusatzinformation/kategorien',
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
		description: 'ID of additional information category',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['additionalInformationCategory'],
				operation: ['get'],
			},
		},
	},
];
