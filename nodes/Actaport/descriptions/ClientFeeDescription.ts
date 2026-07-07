import type { INodeProperties } from 'n8n-workflow';

export const clientFeeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['clientFee'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get client fee',
				description: 'Get fee of a client',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/beteiligte/{{$parameter["beteiligterId"]}}/honorar',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update client fee',
				description: 'Update fee of a client',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/beteiligte/{{$parameter["beteiligterId"]}}/honorar',
					},
				},
			},
		],
		default: 'get',
	},
	{
		displayName: 'Sequential Number',
		name: 'laufendeNummer',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['get', 'update'],
				resource: ['clientFee'],
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
				operation: ['get', 'update'],
				resource: ['clientFee'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'Client',
		name: 'beteiligterId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		modes: [
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
			},
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getClients',
					searchable: false,
					searchFilterRequired: false,
				},
			},
		],
		displayOptions: {
			show: {
				operation: ['get', 'update'],
				resource: ['clientFee'],
			},
		},
	},
	{
		displayName: 'Fee Category',
		name: 'typ',
		type: 'options',
		required: true,
		default: 'RVG',
		options: [
			{ name: 'RVG', value: 'RVG' },
			{ name: 'Hourly Rate', value: 'STUNDENSATZ' },
			{ name: 'Lump Sum', value: 'PAUSCHAL' },
			{ name: 'Lump Sum / Hourly Rate', value: 'PAUSCHALZEIT' },
		],
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
		},
		routing: {
			send: {
				property: 'typ',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Lump Sum Fee',
		name: 'pauschal',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
			maxValue: 999999,
		},
		default: 1,
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				typ: ['RVG', 'STUNDENSATZ'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'pauschal',
			},
		},
	},
	{
		displayName: 'Included Hours',
		name: 'inklusivstunden',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 1,
			maxValue: 9999,
		},
		default: 1,
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				typ: ['RVG', 'STUNDENSATZ', 'PAUSCHAL'],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'inklusivstunden',
			},
		},
	},
	{
		displayName: 'Hourly Rates',
		name: 'benutzerStundensaetze',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				typ: ['RVG', 'PAUSCHAL'],
			},
		},
		placeholder: 'Add Hourly Rates',
		options: [
			{
				displayName: 'User / Hourly Rate',
				name: 'hourlyRate',
				values: [
					{
						displayName: 'User',
						name: 'benutzer',
						required: true,
						type: 'resourceLocator',
						default: { mode: 'list', value: '' },
						modes: [
							{
								displayName: 'By ID',
								name: 'id',
								type: 'string',
							},
							{
								displayName: 'From List',
								name: 'list',
								type: 'list',
								typeOptions: {
									searchListMethod: 'getUsers',
									searchable: false,
									searchFilterRequired: false,
								},
							},
						],
					},
					{
						displayName: 'Hourly Rate',
						name: 'stundensatz',
						required: true,
						type: 'number',
						default: 1,
					},
				],
			},
		],
		routing: {
			send: {
				property: 'benutzerStundensaetze',
				type: 'body',
				value: `={{ 
            Array.isArray($value.hourlyRate) && $value.hourlyRate.length > 0 
                ? $value.hourlyRate.map(entry => ({
                    benutzer: entry.benutzer?.value ? { id: entry.benutzer.value } : undefined,
                    stundensatz: entry.stundensatz,
                })) 
                : undefined 
        }}`,
			},
		},
	},
	{
		displayName: 'Increment',
		name: 'taktung',
		type: 'options',
		default: 'noop',
		required: true,
		options: [
			{ name: '-', value: 'noop' },
			{ name: '10-Minute Based', value: 'TAKT_10' },
			{ name: '15-Minute Based', value: 'TAKT_15' },
			{ name: '6-Minute Based', value: 'TAKT_6' },
			{ name: 'Minute Based', value: 'TAKT_1' },
		],
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				typ: ['RVG', 'PAUSCHAL'],
			},
		},
		routing: {
			send: {
				property: 'taktung',
				type: 'body',
				value: '={{ $value === "noop" ? undefined : $value }}',
			},
		},
	},
	{
		displayName: 'Proceeds Distribution with Cost Centers',
		name: 'erloesverteilungNachKostenstellen',
		type: 'options',
		default: '',
		description: 'Whether to distribute proceeds with cost centers',
		options: [
			{
				name: '-',
				value: '',
			},
			{
				name: 'True',
				value: true,
			},
			{
				name: 'False',
				value: false,
			},
		],
		routing: {
			send: {
				property: 'erloesverteilungNachKostenstellen',
				type: 'body',
				value: '={{ $value || undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
		},
	},
	{
		displayName: 'Cost Center Distributions',
		name: 'erloesverteilungen',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		options: [
			{
				displayName: 'Distribution',
				name: 'distribution',
				values: [
					{
						displayName: 'Cost Center Name or ID',
						name: 'kostenstelle',
						required: true,
						type: 'options',
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getCostCenters',
						},
					},
					{
						displayName: 'Distribution Type',
						name: 'verteilung',
						type: 'options',
						required: true,
						default: 'PROZENT',
						options: [
							{ name: 'According to Proceeds', value: 'ERLOES' },
							{ name: 'According to Percentage', value: 'PROZENT' },
						],
					},
					{
						displayName: 'Percentage',
						name: 'anteil',
						required: true,
						type: 'number',
						default: 100,
						validateType: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						displayOptions: {
							show: {
								verteilung: ['PROZENT'],
							},
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				erloesverteilungNachKostenstellen: ['', false],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'erloesverteilungen',
				value: `={{ 
  $value.distribution
    ? $value.distribution.map(item => {
        const [id, nummer] = (item.kostenstelle || '').split('::');
        return {
          ...item,
          kostenstelle: id ? { id, kostenstellennummer: nummer, benutzer: { id: '00000000-0000-0000-0000-000000000000' } } : undefined,
        };
      })
    : undefined
}}`,
			},
		},
	},
	{
		displayName: 'Cost Center User Assignments',
		name: 'kostenstellenzuordnungen',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: [],
		description:
			'For each cost center above that uses "According to Proceeds", assign a user. Only cost centers already added in "Cost Center Distributions" are valid.',
		options: [
			{
				displayName: 'Assignment',
				name: 'assignment',
				values: [
					{
						displayName: 'Cost Center Name or ID',
						name: 'kostenstelle',
						required: true,
						type: 'options',
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getCostCenters',
						},
					},
					{
						displayName: 'User Name or ID',
						name: 'benutzer',
						required: true,
						type: 'options',
						default: '',
						description:
							'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getClerks',
						},
					},
				],
			},
		],
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
			hide: {
				erloesverteilungNachKostenstellen: ['', false],
			},
		},
		routing: {
			send: {
				type: 'body',
				property: 'kostenstellenzuordnungen',
				value: `={{ 
        $value.assignment
          ? $value.assignment.map(item => {
              const [kostenstelleId, kostenstellenNummer] = (item.kostenstelle || '').split('::');
              const [benutzerId] = (item.benutzer || '').split('::');
              return {
                kostenstelle: kostenstelleId
                  ? { id: kostenstelleId, kostenstellennummer: kostenstellenNummer }
                  : undefined,
                benutzer: benutzerId
                  ? { id: benutzerId }
                  : undefined,
              };
            })
          : undefined
      }}`,
			},
		},
	},
	{
		displayName: 'Lump Sum For Expenses',
		name: 'auslagenpauschalen',
		type: 'fixedCollection',
		default: [],
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['clientFee'],
			},
		},
		options: [
			{
				name: 'auslagenpauschale',
				displayName: 'Lump Sum',
				values: [
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						default: 'KEINE',
						options: [
							{ name: 'None', value: 'KEINE' },
							{ name: 'Fixed', value: 'FIX' },
							{ name: 'Percentaged', value: 'PROZENTUAL' },
						],
					},
					{
						displayName: 'Amount',
						name: 'value',
						type: 'number',
						default: 0,
						required: true,
						typeOptions: {
							minValue: 1,
						},
						validateType: 'number',
						displayOptions: {
							hide: {
								type: ['KEINE', 'PROZENTUAL'],
							},
						},
					},
					{
						displayName: 'Interval',
						name: 'intervall',
						type: 'options',
						required: true,
						default: 'EINMALIG',
						options: [
							{ name: 'One-Off', value: 'EINMALIG' },
							{ name: 'Monthly', value: 'MONATLICH' },
							{ name: 'Quarterly', value: 'QUARTALSWEISE' },
							{ name: 'Yearly', value: 'JAEHRLICH' },
						],
						displayOptions: {
							hide: {
								type: ['KEINE', 'PROZENTUAL'],
							},
						},
					},
					{
						displayName: 'Percentage',
						name: 'value',
						type: 'number',
						required: true,
						validateType: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 100,
						},
						default: 100,
						displayOptions: {
							hide: {
								type: ['KEINE', 'FIX'],
							},
						},
					},
				],
			},
		],
		routing: {
			send: {
				property: 'auslagenpauschale',
				type: 'body',
				value: `={{ 
            $value.auslagenpauschale
                ? {
                    type: $value.auslagenpauschale.type,
                    ...($value.auslagenpauschale.type === 'FIX' ? {
                        value: $value.auslagenpauschale.value,
                        intervall: $value.auslagenpauschale.intervall,
                    } : {}),
                    ...($value.auslagenpauschale.type === 'PROZENTUAL' ? {
                        value: $value.auslagenpauschale.value,
                    } : {}),
                  }
                : undefined
        }}`,
			},
		},
	},
];
