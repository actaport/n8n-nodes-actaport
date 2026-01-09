import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCaseFile = {
	resource: ['caseFile'],
};

const showOnlyForCaseFileGet = { operation: ['get', 'update'], resource: ['caseFile'] };

const showOnlyForCaseFileGetAll = { operation: ['getAll'], resource: ['caseFile'] };

export const caseFileDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForCaseFile },
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get case files',
				description: 'Retrieve case files',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten',
						arrayFormat: 'repeat',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get case file',
				description: 'Retrieve case file',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create case file',
				description: 'Create new case file',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten',
					},
					send: {
						preSend: [],
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update case file',
				description: 'Update case',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}',
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
				...showOnlyForCaseFileGet,
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
				...showOnlyForCaseFileGet,
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
				...showOnlyForCaseFileGetAll,
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
				...showOnlyForCaseFileGetAll,
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
				...showOnlyForCaseFileGetAll,
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
				...showOnlyForCaseFileGetAll,
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
		displayName: 'File Name',
		name: 'aktenbezeichnung',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create'],
			},
		},
		routing: {
			send: {
				property: 'aktenbezeichnung',
				type: 'body',
				value: '={{ $value }}',
			},
		},
	},
	{
		displayName: 'File Name',
		name: 'aktenbezeichnung',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['update'],
			},
		},
		routing: {
			send: {
				property: 'aktenbezeichnung',
				type: 'body',
				value: '={{ $value || undefined }}',
			},
		},
	},
	{
		displayName: 'Alternative Reference',
		name: 'alternativeFileReference',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create', 'update'],
			},
		},
		routing: {
			send: {
				property: 'alternativesAktenzeichen',
				type: 'body',
				value: '={{ $value }}',
			},
		},
	},
	{
		displayName: 'Clerk Name or ID',
		name: 'sachbearbeiter',
		type: 'options',
		default: '',
		required: true,
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getClerks',
		},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create'],
			},
		},
		routing: {
			send: {
				property: 'sachbearbeiter',
				type: 'body',
				value: '={{ $value ? { id: $value } : undefined }}',
			},
		},
	},
	{
		displayName: 'Clerk Name or ID',
		name: 'sachbearbeiter',
		type: 'options',
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		typeOptions: {
			loadOptionsMethod: 'getClerks',
		},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['update'],
			},
		},
		routing: {
			send: {
				property: 'sachbearbeiter',
				type: 'body',
				value: '={{ $value ? { id: $value } : undefined }}',
			},
		},
	},
	{
		displayName: 'Assistant Names or IDs',
		name: 'assistenzen',
		type: 'multiOptions',
		default: [],
		required: true,
		description:
			'Assistants of the Case File. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getAssistants',
		},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create'],
			},
		},
		routing: {
			send: {
				property: 'assistenzen',
				type: 'body',
				value: '={{ $value ? $value.map(id => ({ id })) : [] }}',
			},
		},
	},
	{
		displayName: 'Assistant Names or IDs',
		name: 'assistenzen',
		type: 'multiOptions',
		default: [],
		description:
			'Assistants of the Case File. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getAssistants',
		},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['update'],
			},
		},
		routing: {
			send: {
				property: 'assistenzen',
				type: 'body',
				value: '={{ $value ? $value.map(id => ({ id })) : undefined }}',
			},
		},
	},
	{
		displayName: 'Involved Parties',
		name: 'beteiligte',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Involved Party',
				name: 'beteiligter',
				values: [
					{
						displayName: 'Contact ID',
						name: 'kontaktId',
						type: 'resourceLocator',
						required: true,
						default: { mode: 'id', value: '' },
						modes: [
							{
								displayName: 'From List',
								name: 'list',
								type: 'list',
								typeOptions: {
									searchListMethod: 'getContacts',
									searchable: true,
								},
							},
							{
								displayName: 'By ID',
								name: 'id',
								type: 'string',
								placeholder: 'Enter contact ID',
							},
						],
					},
					{
						displayName: 'Roles',
						name: 'rollen',
						type: 'fixedCollection',
						default: {},
						typeOptions: { multipleValues: false },
						options: [
							{
								displayName: 'Rollen',
								name: 'fields',
								values: [
									{
										displayName: 'Main Role',
										name: 'hauptrolle',
										type: 'options',
										required: true,
										default: 'Mandant',
										options: [
											{ name: 'Gegner', value: 'Gegner' },
											{ name: 'Gericht/Behörde', value: 'Gericht/Behörde' },
											{ name: 'Mandant', value: 'Mandant' },
											{ name: 'Mandant/Gegner', value: 'Mandant_Gegner' },
											{ name: 'Sonstige Beteiligte', value: 'Sonstige Beteiligte' },
										],
									},
									{
										displayName: 'Sub Role',
										name: 'unterrolle',
										type: 'string',
										required: true,
										default: '',
									},
								],
							},
						],
					},
					{
						displayName: 'Details',
						name: 'details',
						type: 'collection',
						default: {},
						options: [
							{
								displayName: 'File Reference',
								name: 'aktenzeichen',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Tax Treatment',
								name: 'umsatzsteuerlicheBehandlung',
								type: 'options',
								default: 'DE',
								options: [
									{ name: 'DE', value: 'DE' },
									{ name: 'EU', value: 'EU' },
									{ name: 'Third Country', value: 'DRITTLAND' },
								],
							},
							{
								displayName: 'Tax Deductible',
								name: 'vorsteuerabzug',
								type: 'boolean',
								default: false,
							},
							{
								displayName: 'Contact Persons',
								name: 'ansprechpartner',
								type: 'fixedCollection',
								default: {},
								typeOptions: { multipleValues: true },
								options: [
									{
										displayName: 'Contact Person',
										name: 'person',
										values: [
											{
												displayName: 'Contact ID',
												name: 'kontaktId',
												type: 'string',
												required: true,
												default: '',
											},
										],
									},
								],
							},
						],
					},
					{
						displayName: 'Sub-Involved Parties',
						name: 'unterbeteiligte',
						type: 'fixedCollection',
						default: {},
						typeOptions: { multipleValues: true },
						options: [
							{
								displayName: 'Sub-Involved Party',
								name: 'ub',
								values: [
									{
										displayName: 'Contact ID',
										name: 'kontaktId',
										type: 'string',
										required: true,
										default: '',
									},
									{
										displayName: 'Role',
										name: 'rolle',
										type: 'string',
										required: true,
										default: '',
									},
									{
										displayName: 'Details',
										name: 'details',
										type: 'collection',
										default: {},
										options: [
											{
												displayName: '',
												name: 'Claim Number',
												type: 'string',
												default: '',
											},
											{
												displayName: 'Insurance Number',
												name: 'versicherungsnummer',
												type: 'string',
												default: '',
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
		routing: {
			send: {
				property: 'beteiligte',
				type: 'body',
				value: `={{ 
					($value.beteiligter || []).map(b => ({
						kontakt: { id: Number(b.kontaktId?.value) || undefined },
						rolle: {
							hauptrolle: b.rollen?.fields?.hauptrolle,
							unterrolle: b.rollen?.fields?.unterrolle,
						},
						details: {
							aktenzeichen: b.details?.aktenzeichen,
							umsatzsteuerlicheBehandlung: b.details?.umsatzsteuerlicheBehandlung,
							vorsteuerabzug: b.details?.vorsteuerabzug,
							ansprechpartner:
								(b.details?.ansprechpartner?.person || []).map(p => ({ id: Number(p.kontaktId) })),
						},
						unterbeteiligte:
							(b.unterbeteiligte?.ub || []).map(u => ({
								kontakt: { id: Number(u.kontaktId) },
								rolle: u.rolle,
								details: {
									schadensnummer: u.details?.schadensnummer || undefined,
									versicherungsnummer: u.details?.versicherungsnummer || undefined,
								},
							})),
					}))
				}}`,
			},
		},
	},
	{
		displayName: 'File Role',
		name: 'aktenrolle',
		type: 'options',
		default: 'HAUPTAKTE',
		options: [
			{ name: 'Main File', value: 'HAUPTAKTE' },
			{ name: 'Sub File', value: 'UNTERAKTE' },
		],
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create', 'update'],
			},
		},
		routing: {
			send: {
				property: 'aktenrolle',
				type: 'body',
				value: '={{ $value }}',
			},
		},
	},
	{
		displayName: 'Parent File Number',
		name: 'uebergeordneteAkteNummer',
		type: 'string',
		default: '',
		required: true,
		description: 'The file number of the parent file (only for Sub Files)',
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create'],
				aktenrolle: ['UNTERAKTE'],
			},
		},
		routing: {
			send: {
				property: 'uebergeordneteAkte',
				type: 'body',
				value: `={{
					$parameter.aktenrolle === "UNTERAKTE"
						? { aktennummer: $value }
						: undefined
				}}`,
			},
		},
	},
	{
		displayName: 'Parent File Number',
		name: 'uebergeordneteAkteNummer',
		type: 'string',
		default: '',
		description: 'The file number of the parent file (only for Sub Files)',
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['update'],
				aktenrolle: ['UNTERAKTE'],
			},
		},
		routing: {
			send: {
				property: 'uebergeordneteAkte',
				type: 'body',
				value: `={{
					$parameter.aktenrolle === "UNTERAKTE"
						? { aktennummer: $value }
						: undefined
				}}`,
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add field',
		default: {},
		displayOptions: {
			show: {
				...showOnlyForCaseFile,
				operation: ['create', 'update'],
			},
		},
		options: [
			{
				displayName: 'Additional Informations',
				name: 'zusatzinformationen',
				type: 'fixedCollection',
				default: {},
				typeOptions: { multipleValues: true },
				options: [
					{
						displayName: 'Additional Information',
						name: 'info',
						values: [
							{
								displayName: 'ID',
								name: 'id',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Additional Fields',
								name: 'zusatzfelder',
								type: 'fixedCollection',
								default: {},
								typeOptions: { multipleValues: true },
								options: [
									{
										displayName: 'Additional Field',
										name: 'feld',
										values: [
											{
												displayName: 'ID',
												name: 'id',
												type: 'string',
												required: true,
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
							},
						],
					},
				],
				routing: {
					send: {
						property: 'zusatzinformationen',
						type: 'body',
						value: `={{ 
							($value.info || []).map(i => ({
								id: i.id,
								zusatzfelder: (i.zusatzfelder?.feld || []).map(f => ({
									id: f.id,
									value:
										f.value === 'true' ? true :
										f.value === 'false' ? false :
										!isNaN(Number(f.value)) && f.value.trim() !== '' ? Number(f.value) :
										f.value,
								})),
							}))
						}}`,
					},
				},
			},
			{
				displayName: 'Areas of Law',
				name: 'rechtsgebiete',
				type: 'fixedCollection',
				default: {},
				typeOptions: { multipleValues: true },
				options: [
					{
						displayName: 'Area of Law',
						name: 'gebiet',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								required: true,
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'rechtsgebiete',
						type: 'body',
						value: '={{ $value.gebiet?.map(g => g.name) }}',
					},
				},
			},
			{
				displayName: 'Dispute Value',
				name: 'gegenstandswert',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'gegenstandswert',
						type: 'body',
						value: '={{ $value }}',
					},
				},
			},
			{
				displayName: 'Keywords',
				name: 'schlagworte',
				type: 'fixedCollection',
				default: {},
				typeOptions: { multipleValues: true },
				options: [
					{
						displayName: 'Keyword',
						name: 'wort',
						values: [
							{
								displayName: 'Word',
								name: 'name',
								type: 'string',
								default: '',
								required: true,
							},
						],
					},
				],
				routing: {
					send: {
						property: 'schlagworte',
						type: 'body',
						value: '={{ $value.wort?.map(w => w.name) }}',
					},
				},
			},
			{
				displayName: 'Reason',
				name: 'wegen',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'wegen',
						type: 'body',
						value: '={{ $value }}',
					},
				},
			},
		],
	},
];
