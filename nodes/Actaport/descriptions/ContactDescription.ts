import type { INodeProperties } from 'n8n-workflow';

const showOnlyForContact = {
	resource: ['contact'],
};

const showOnlyForContactCreate = { operation: ['create'], resource: ['contact'] };
const showOnlyForContactUpdate = { operation: ['update'], resource: ['contact'] };
const showOnlyForContactGet = { operation: ['get'], resource: ['contact'] };

export const contactDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForContact },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a contact',
				description: 'Retrieves the metadata of a contact',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/kontakte/{{$parameter.id}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many contacts',
				description: 'Retrieves multiple contacts',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/kontakte',
						arrayFormat: 'repeat',
					},
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a contact',
				description: 'Creates a new contact with the given data',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/kontakte',
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a contact',
				description: 'Updates the data of a contact',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/kontakte/{{$parameter.id}}',
					},
				},
			},
		],
		default: 'get',
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
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
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
				resource: ['contact'],
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
		description: 'ID of the contact to retrieve',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForContactGet,
			},
		},
	},
	// === MAIN FIELDS ===
	{
		displayName: 'First Name',
		name: 'vorname',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'vorname',
				type: 'body',
				value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
			},
		},
		displayOptions: { show: { ...showOnlyForContactCreate } },
	},
	{
		displayName: 'Last Name',
		required: true,
		name: 'name',
		type: 'string',
		default: '',
		routing: { send: { property: 'name', type: 'body' } },
		displayOptions: { show: { ...showOnlyForContactCreate } },
	},
	{
		displayName: 'Type',
		required: true,
		name: 'typ',
		type: 'options',
		default: 'NATUERLICHE_PERSON',
		options: [
			{ name: 'Natural Person', value: 'NATUERLICHE_PERSON' },
			{ name: 'Legal Entity', value: 'JURISTISCHE_PERSON' },
		],
		routing: { send: { property: 'typ', type: 'body' } },
		displayOptions: { show: { ...showOnlyForContactCreate } },
	},

	// === ADDITIONAL FIELDS ===
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add field',
		displayOptions: { show: { ...showOnlyForContactCreate } },
		default: {},
		options: [
			{
				displayName: 'Academic Title',
				name: 'akademischerTitel',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Title',
				},
				options: [
					{
						displayName: 'Title',
						name: 'titel',
						values: [
							{
								displayName: 'Title',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'akademischerTitel',
						type: 'body',
						value:
							'={{ Array.isArray($value.titel) && $value.titel.length > 0 ? $value.titel.map(t => t.value) : undefined }}',
					},
				},
			},
			{
				displayName: 'Addresses',
				name: 'adressen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add new address',
				},
				options: [
					{
						displayName: 'Address',
						name: 'adresse',
						values: [
							{
								displayName: 'Additional Adress Information',
								name: 'adresszusatz',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Recipient',
								name: 'empfaenger',
								type: 'string',
								default: '',
							},
							{
								displayName: 'House Number',
								name: 'hausnummer',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'land',
								type: 'string',
								default: 'Deutschland',
							},
							{
								displayName: 'Place',
								name: 'ort',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Address',
								description: 'Whether this is a postal address',
								name: 'postalischeAdresse',
								type: 'boolean',
								default: false,
							},
							{
								displayName: 'Postcode',
								name: 'postleitzahl',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Street / P.O. Box',
								name: 'strassePostfach',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'typ',
								type: 'options',
								default: 'PRIVAT',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
									{ name: 'Other', value: 'ANDERE' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'adressen',
						type: 'body',
						value:
							'={{ Array.isArray($value.adresse) && $value.adresse.length > 0 ? $value.adresse : undefined }}',
					},
				},
			},
			{
				displayName: 'Bank Accounts',
				name: 'kontoverbindungen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Bank Account',
				},
				options: [
					{
						displayName: 'Bank Account',
						name: 'konto',
						values: [
							{
								displayName: 'IBAN',
								name: 'iban',
								type: 'string',
								default: '',
							},
							{
								displayName: 'BIC',
								name: 'bic',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Account Holder',
								name: 'kontoinhaber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Bank Name',
								name: 'kreditinstitut',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'kontoverbindungen',
						type: 'body',
						value:
							'={{ Array.isArray($value.konto) && $value.konto.length > 0 ? $value.konto : undefined }}',
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
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Contact Persons',
				name: 'ansprechpartner',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Contact Person',
				},
				options: [
					{
						displayName: 'Contact Person',
						name: 'person',
						values: [
							{
								displayName: 'Contact ID',
								name: 'id',
								type: 'number',
								default: 0,
							},
							{
								displayName: 'Display Name',
								name: 'anzeigename',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'ansprechpartner',
						type: 'body',
						value:
							'={{ Array.isArray($value.person) && $value.person.length > 0 ? $value.person : undefined }}',
					},
				},
			},
			{
				displayName: 'Date of Birth',
				name: 'geburtsdatum',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						property: 'geburtsdatum',
						type: 'body',
						value: '={{ $value ? $value.split("T")[0] : undefined }}',
					},
				},
			},
			{
				displayName: 'E-Mail Addresses',
				name: 'emailAdressen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add E-Mail Address',
				},
				options: [
					{
						displayName: 'E-Mail Address',
						name: 'email',
						values: [
							{
								displayName: 'Address',
								name: 'wert',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'emailAdressen',
						type: 'body',
						value:
							'={{ Array.isArray($value.email) && $value.email.length > 0 ? $value.email.map(e => e.wert) : undefined }}',
					},
				},
			},
			{
				displayName: 'Favorite',
				description: 'Whether this contact is a favorite',
				name: 'favorit',
				type: 'boolean',
				default: false,
				routing: { send: { property: 'favorit', type: 'body' } },
			},
			{
				displayName: 'Fax Numbers',
				name: 'faxnummern',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Fax Number',
				},
				options: [
					{
						displayName: 'Fax Number',
						name: 'faxnummer',
						values: [
							{
								displayName: 'Number',
								name: 'wert',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'typ',
								type: 'options',
								default: 'GESCHAEFTLICH',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'faxnummern',
						type: 'body',
						value:
							'={{ Array.isArray($value.faxnummer) && $value.faxnummer.length > 0 ? $value.faxnummer : undefined }}',
					},
				},
			},
			{
				displayName: 'Insurance Number',
				name: 'versicherungsnummer',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'versicherungsnummer',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Legal Form',
				name: 'rechtsform',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'rechtsform',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Legal Protection Insurance',
				name: 'rechtsschutzversicherung',
				description: 'Whether the contact has legal protection insurance',
				type: 'boolean',
				default: false,
				routing: { send: { property: 'rechtsschutzversicherung', type: 'body' } },
			},
			{
				displayName: 'Legal Representatives',
				name: 'gesetzlicheVertreter',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Legal Representative',
				},
				options: [
					{
						displayName: 'Representative',
						name: 'vertreter',
						values: [
							{
								displayName: 'Type',
								name: 'typ',
								type: 'string',
								default: '',
								description: 'Type of legal representative (e.g., guardian, custodian)',
								required: true,
							},
							{
								displayName: 'Contact',
								name: 'kontakt',
								type: 'collection',
								required: true,
								default: {},
								options: [
									{
										displayName: 'Contact ID',
										name: 'id',
										type: 'number',
										default: 0,
									},
									{
										displayName: 'Display Name',
										name: 'anzeigename',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'gesetzlicheVertreter',
						type: 'body',
						value:
							'={{ Array.isArray($value.vertreter) && $value.vertreter.length > 0 ? $value.vertreter : undefined }}',
					},
				},
			},
			{
				displayName: 'Letter Salutation',
				name: 'briefanrede',
				description:
					'Letter salutation for the contact. If not set, the salutation will be automatically generated from the system.',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'briefanrede',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Name Prefix',
				name: 'namensvorsatz',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'namensvorsatz',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Nationality',
				name: 'staatsangehoerigkeit',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'staatsangehoerigkeit',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Occupation',
				name: 'beruf',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'beruf',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Salutation',
				name: 'anrede',
				type: 'string',
				default: '',
				routing: { send: { property: 'anrede', type: 'body' } },
			},
			{
				displayName: 'Tax Number',
				name: 'steuernummer',
				type: 'string',
				default: '',
				routing: { send: { property: 'steuernummer', type: 'body' } },
			},
			{
				displayName: 'Telephone Numbers',
				name: 'telefonnummern',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Telephone Number',
				},
				options: [
					{
						displayName: 'Telephone Number',
						name: 'telefonnummer',
						values: [
							{
								displayName: 'Number',
								required: true,
								name: 'wert',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								required: true,
								name: 'typ',
								type: 'options',
								default: 'GESCHAEFTLICH',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
									{ name: 'Mobile', value: 'MOBIL' },
									{ name: 'Other', value: 'ANDERE' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'telefonnummern',
						type: 'body',
						value:
							'={{ Array.isArray($value.telefonnummer) && $value.telefonnummer.length > 0 ? $value.telefonnummer : undefined }}',
					},
				},
			},
			{
				displayName: 'VAT Identification Number',
				name: 'ustIDNr',
				type: 'string',
				default: '',
				routing: { send: { property: 'ustIdNr', type: 'body' } },
			},
		],
	},
	// === MAIN FIELDS ===
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForContactUpdate,
			},
		},
	},
	{
		displayName: 'First Name',
		name: 'vorname',
		type: 'string',
		default: '',
		routing: {
			send: {
				property: 'vorname',
				type: 'body',
				value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
			},
		},
		displayOptions: { show: { ...showOnlyForContactUpdate } },
	},
	{
		displayName: 'Last Name',
		required: true,
		name: 'name',
		type: 'string',
		default: '',
		routing: { send: { property: 'name', type: 'body' } },
		displayOptions: { show: { ...showOnlyForContactUpdate } },
	},
	{
		displayName: 'Type',
		required: true,
		name: 'typ',
		type: 'options',
		default: 'NATUERLICHE_PERSON',
		options: [
			{ name: 'Natural Person', value: 'NATUERLICHE_PERSON' },
			{ name: 'Legal Entity', value: 'JURISTISCHE_PERSON' },
		],
		routing: { send: { property: 'typ', type: 'body' } },
		displayOptions: { show: { ...showOnlyForContactUpdate } },
	},

	// === ADDITIONAL FIELDS ===
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: { show: { ...showOnlyForContactUpdate } },
		default: {},
		options: [
			{
				displayName: 'Academic Title',
				name: 'akademischerTitel',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Title',
				},
				options: [
					{
						displayName: 'Title',
						name: 'titel',
						values: [
							{
								displayName: 'Title',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'akademischerTitel',
						type: 'body',
						value:
							'={{ Array.isArray($value.titel) && $value.titel.length > 0 ? $value.titel.map(t => t.value) : undefined }}',
					},
				},
			},
			{
				displayName: 'Addresses',
				name: 'adressen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add new address',
				},
				options: [
					{
						displayName: 'Address',
						name: 'adresse',
						values: [
							{
								displayName: 'Additional Adress Information',
								name: 'adresszusatz',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Recipient',
								name: 'empfaenger',
								type: 'string',
								default: '',
							},
							{
								displayName: 'House Number',
								name: 'hausnummer',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Country',
								name: 'land',
								type: 'string',
								default: 'Deutschland',
							},
							{
								displayName: 'Place',
								name: 'ort',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Postal Address',
								description: 'Whether this is a postal address',
								name: 'postalischeAdresse',
								type: 'boolean',
								default: false,
							},
							{
								displayName: 'Postcode',
								name: 'postleitzahl',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Street / P.O. Box',
								name: 'strassePostfach',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'typ',
								type: 'options',
								default: 'PRIVAT',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
									{ name: 'Other', value: 'ANDERE' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'adressen',
						type: 'body',
						value:
							'={{ Array.isArray($value.adresse) && $value.adresse.length > 0 ? $value.adresse : undefined }}',
					},
				},
			},
			{
				displayName: 'Bank Accounts',
				name: 'kontoverbindungen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Bank Account',
				},
				options: [
					{
						displayName: 'Bank Account',
						name: 'konto',
						values: [
							{
								displayName: 'IBAN',
								name: 'iban',
								type: 'string',
								default: '',
							},
							{
								displayName: 'BIC',
								name: 'bic',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Account Holder',
								name: 'kontoinhaber',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Bank Name',
								name: 'kreditinstitut',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'kontoverbindungen',
						type: 'body',
						value:
							'={{ Array.isArray($value.konto) && $value.konto.length > 0 ? $value.konto : undefined }}',
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
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Contact Persons',
				name: 'ansprechpartner',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Contact Person',
				},
				options: [
					{
						displayName: 'Contact Person',
						name: 'person',
						values: [
							{
								displayName: 'Contact ID',
								name: 'id',
								type: 'number',
								default: 0,
							},
							{
								displayName: 'Display Name',
								name: 'anzeigename',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'ansprechpartner',
						type: 'body',
						value:
							'={{ Array.isArray($value.person) && $value.person.length > 0 ? $value.person : undefined }}',
					},
				},
			},
			{
				displayName: 'Date of Birth',
				name: 'geburtsdatum',
				type: 'dateTime',
				default: '',
				routing: {
					send: {
						property: 'geburtsdatum',
						type: 'body',
						value: '={{ $value ? $value.split("T")[0] : undefined }}',
					},
				},
			},
			{
				displayName: 'E-Mail Addresses',
				name: 'emailAdressen',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add E-Mail Address',
				},
				options: [
					{
						displayName: 'E-Mail Address',
						name: 'email',
						values: [
							{
								displayName: 'Address',
								name: 'wert',
								type: 'string',
								default: '',
							},
						],
					},
				],
				routing: {
					send: {
						property: 'emailAdressen',
						type: 'body',
						value:
							'={{ Array.isArray($value.email) && $value.email.length > 0 ? $value.email.map(e => e.wert) : undefined }}',
					},
				},
			},
			{
				displayName: 'Favorite',
				description: 'Whether this contact is a favorite',
				name: 'favorit',
				type: 'options',
				default: '',
				options: [
					{ name: 'Not Set', value: '' },
					{ name: 'Yes', value: true },
					{ name: 'No', value: false },
				],
				routing: {
					send: {
						property: 'favorit',
						type: 'body',
						value: '={{ $value === "" ? undefined : $value }}',
					},
				},
			},
			{
				displayName: 'Fax Numbers',
				name: 'faxnummern',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Fax Number',
				},
				options: [
					{
						displayName: 'Fax Number',
						name: 'faxnummer',
						values: [
							{
								displayName: 'Number',
								name: 'wert',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								name: 'typ',
								type: 'options',
								default: 'GESCHAEFTLICH',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'faxnummern',
						type: 'body',
						value:
							'={{ Array.isArray($value.faxnummer) && $value.faxnummer.length > 0 ? $value.faxnummer : undefined }}',
					},
				},
			},
			{
				displayName: 'Insurance Number',
				name: 'versicherungsnummer',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'versicherungsnummer',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Legal Form',
				name: 'rechtsform',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'rechtsform',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Legal Protection Insurance',
				name: 'rechtsschutzversicherung',
				description: 'Whether the contact has legal protection insurance',
				type: 'options',
				default: '',
				options: [
					{ name: 'Not Set', value: '' },
					{ name: 'Yes', value: true },
					{ name: 'No', value: false },
				],
				routing: {
					send: {
						property: 'rechtsschutzversicherung',
						type: 'body',
						value: '={{ $value === "" ? undefined : $value }}',
					},
				},
			},
			{
				displayName: 'Legal Representatives',
				name: 'gesetzlicheVertreter',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Legal Representative',
				},
				options: [
					{
						displayName: 'Representative',
						name: 'vertreter',
						values: [
							{
								displayName: 'Type',
								name: 'typ',
								type: 'string',
								default: '',
								description: 'Type of legal representative (e.g., guardian, custodian)',
								required: true,
							},
							{
								displayName: 'Contact',
								name: 'kontakt',
								type: 'collection',
								required: true,
								default: {},
								options: [
									{
										displayName: 'Contact ID',
										name: 'id',
										type: 'number',
										default: 0,
									},
									{
										displayName: 'Display Name',
										name: 'anzeigename',
										type: 'string',
										default: '',
									},
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'gesetzlicheVertreter',
						type: 'body',
						value:
							'={{ Array.isArray($value.vertreter) && $value.vertreter.length > 0 ? $value.vertreter : undefined }}',
					},
				},
			},
			{
				displayName: 'Letter Salutation',
				name: 'briefanrede',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'briefanrede',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Name Prefix',
				name: 'namensvorsatz',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'namensvorsatz',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Nationality',
				name: 'staatsangehoerigkeit',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'staatsangehoerigkeit',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Occupation',
				name: 'beruf',
				type: 'string',
				default: '',
				routing: {
					send: {
						property: 'beruf',
						type: 'body',
						value: '={{ $value && $value.trim() !== "" ? $value : undefined }}',
					},
				},
			},
			{
				displayName: 'Salutation',
				name: 'anrede',
				type: 'string',
				default: '',
				routing: { send: { property: 'anrede', type: 'body' } },
			},
			{
				displayName: 'Tax Number',
				name: 'steuernummer',
				type: 'string',
				default: '',
				routing: { send: { property: 'steuernummer', type: 'body' } },
			},
			{
				displayName: 'Telephone Numbers',
				name: 'telefonnummern',
				type: 'fixedCollection',
				default: [],
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add Telephone Number',
				},
				options: [
					{
						displayName: 'Telephone Number',
						name: 'telefonnummer',
						values: [
							{
								displayName: 'Number',
								required: true,
								name: 'wert',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Type',
								required: true,
								name: 'typ',
								type: 'options',
								default: 'GESCHAEFTLICH',
								options: [
									{ name: 'Private', value: 'PRIVAT' },
									{ name: 'Business', value: 'GESCHAEFTLICH' },
									{ name: 'Mobile', value: 'MOBIL' },
									{ name: 'Other', value: 'ANDERE' },
								],
							},
						],
					},
				],
				routing: {
					send: {
						property: 'telefonnummern',
						type: 'body',
						value:
							'={{ Array.isArray($value.telefonnummer) && $value.telefonnummer.length > 0 ? $value.telefonnummer : undefined }}',
					},
				},
			},
			{
				displayName: 'VAT Identification Number',
				name: 'ustIDNr',
				type: 'string',
				default: '',
				routing: { send: { property: 'ustIdNr', type: 'body' } },
			},
		],
	},
];
