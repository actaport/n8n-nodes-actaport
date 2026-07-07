import { INodeParameterResourceLocator, INodeProperties, NodeOperationError } from 'n8n-workflow';
import { preSendUpload, returnBinaryData } from '../helpers';

const showOnlyForDocument = {
	resource: ['document'],
};

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForDocument },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create document',
				description:
					'Create a new document with template if supported. If no template is specified, a blank document will be created.',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/dokumente/neu',
					},
				},
			},
			{
				name: 'Download',
				value: 'download',
				action: 'Download document',
				description: 'Download a single document',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/documents/{{$parameter["id"]}}',
						returnFullResponse: true,
						encoding: 'arraybuffer',
					},
					output: {
						postReceive: [returnBinaryData],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get document',
				description: 'Get a single document',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/dokumente/{{$parameter["id"]}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get documents',
				description: 'Retrieve many documents',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/akten/{{$parameter["laufendeNummer"]}}/{{$parameter["bezugsJahr"]}}/dokumente/uebersicht',
						arrayFormat: 'repeat',
						qs: {
							size: "={{ $parameter['returnAll'] ? 50 : $parameter['size'] }}",
						},
					},
					send: {
						paginate: "={{ $parameter['returnAll'] }}",
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'content',
								},
							},
						],
					},
					operations: {
						pagination: {
							type: 'generic',
							properties: {
								continue: '={{ !$response.body?.last }}',
								request: {
									qs: {
										page: '={{ ($response.body?.number ?? -1) + 1 }}',
										size: '={{ $response.body?.size ?? 100 }}',
										filter: '={{ $request.qs?.filter }}',
										sort: '={{ $request.qs?.sort }}',
									},
								},
							},
						},
					},
				},
			},
			{
				name: 'Search',
				value: 'search',
				action: 'Search documents',
				description:
					'Search documents with a search term. The search will be performed on the document attributes and content.',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/documents/search',
						qs: {
							size: "={{ $parameter['returnAll'] ? 20 : $parameter['size'] }}",
						},
					},
					send: {
						paginate: "={{ $parameter['returnAll'] }}",
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'content',
								},
							},
						],
					},
					operations: {
						pagination: {
							type: 'generic',
							properties: {
								continue: '={{ !$response.body?.last }}',
								request: {
									qs: {
										page: '={{ ($response.body?.number ?? -1) + 1 }}',
										size: '={{ $response.body?.size ?? 20 }}',
										suchbegriff: '={{ $request.qs.suchbegriff }}',
										aktennummer: '={{ $request.qs?.aktennummer }}',
									},
								},
							},
						},
					},
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update document',
				description: 'Update a single document',
				routing: {
					request: {
						method: 'PUT',
						url: '=/v1/documents/{{$parameter["id"]}}/metadata',
					},
				},
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload document',
				description: 'Upload a document to a case',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/akten/{{$parameter.laufendeNummer}}/{{$parameter.bezugsJahr}}/dokumente',
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					},
					send: {
						preSend: [preSendUpload],
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
				operation: ['create', 'get', 'getAll', 'upload'],
				resource: ['document'],
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
				operation: ['create', 'get', 'getAll', 'upload'],
				resource: ['document'],
			},
		},
		default: '',
		description: 'Reference year of the case',
	},
	{
		displayName: 'ID',
		name: 'id',
		required: true,
		description: 'ID of the document',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['download', 'get', 'update'],
				resource: ['document'],
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
				operation: ['getAll', 'search'],
				resource: ['document'],
				returnAll: [false],
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
				resource: ['document'],
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Size',
		name: 'size',
		description: 'The size of the page to return',
		default: 10,
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 20,
		},
		routing: {
			send: {
				type: 'query',
				property: 'size',
			},
		},
		displayOptions: {
			show: {
				operation: ['search'],
				resource: ['document'],
				returnAll: [false],
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
				resource: ['document'],
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
				resource: ['document'],
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
		displayName: 'Search Term',
		required: true,
		name: 'searchTerm',
		type: 'string',
		placeholder: 'Enter search term to search in documents',
		default: '',
		description: 'Term to search for in documents',
		routing: {
			send: {
				type: 'query',
				property: 'suchbegriff',
			},
		},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Return Specific Case File Documents',
		name: 'returnSpecificCaseFileDocuments',
		type: 'boolean',
		default: false,
		description:
			'Whether to return only documents associated with the specified case file or documents from the entire system',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Case File Number',
		name: 'caseFileNumber',
		required: true,
		type: 'string',
		default: '',
		placeholder: 'Enter case file number to filter documents',
		description: 'Case file number to filter documents associated with a specific case file',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['search'],
				returnSpecificCaseFileDocuments: [true],
			},
		},
		routing: {
			send: {
				type: 'query',
				property: 'aktennummer',
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['getAll', 'search'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'Name of the document',
		routing: {
			send: {
				property: 'name',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Description of the document',
		routing: {
			send: {
				property: 'beschreibung',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'string',
		default: '',
		description: 'Type of the document',
		routing: {
			send: {
				property: 'typ',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'string',
		default: '',
		description: 'Status of the document',
		routing: {
			send: {
				property: 'status',
				type: 'body',
				value: '={{ $value ? $value : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Created At (Modified)',
		name: 'createdAtModified',
		type: 'dateTime',
		default: '',
		description: 'Creation date of the document (modification date will be set)',
		routing: {
			send: {
				property: 'erzeugtAmModifiziert',
				type: 'body',
				value: '={{ $value ? new Date($value).toISOString() : undefined }}',
			},
		},
		displayOptions: {
			show: {
				operation: ['update'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		required: true,
		type: 'string',
		typeOptions: {
			binaryDataProperty: true,
		},
		default: 'data',
		description: 'Name of the binary property which contains the document data',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
	},
	{
		displayName: 'Automatically Create Folder',
		name: 'autocreateFolder',
		type: 'boolean',
		default: true,
		description:
			'Whether to automatically create the folder with the given name if it does not exist. If disabled only existing folders can be used.',
		displayOptions: {
			show: {
				operation: ['upload'],
				resource: ['document'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Document Name',
				name: 'documentName',
				type: 'string',
				default: '',
				description:
					'Name of the document to upload. If not specified, the original file name will be used.',
			},
			{
				displayName: 'Folder Name',
				name: 'folderName',
				type: 'string',
				displayOptions: {
					hide: {
						'/autocreateFolder': [false],
					},
				},
				default: '',
				description:
					'Name of the folder to upload the document into. If not specified, the document will be uploaded to the default folder.',
			},
			{
				displayName: 'Folder',
				name: 'ordnerId',
				type: 'resourceLocator',
				description: 'ID of the folder to upload the document into',
				default: { mode: 'list', value: '' },
				displayOptions: {
					hide: {
						'/autocreateFolder': [true],
					},
				},
				modes: [
					{
						displayName: 'From List',
						name: 'list',
						type: 'list',
						typeOptions: {
							searchListMethod: 'getFolders',
							searchable: true,
						},
					},
					{
						displayName: 'By ID',
						name: 'id',
						type: 'string',
						placeholder: 'Enter Folder ID',
					},
				],
			},
		],
	},
	{
		displayName: 'Name',
		name: 'documentName',
		type: 'string',
		default: '',
		required: true,
		description: 'Name of the document to create',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		routing: {
			send: {
				property: 'name',
				type: 'body',
				value: '={{ $value === "" ? undefined : $value }}',
			},
		},
	},
	{
		displayName: 'Type',
		name: 'documentType',
		required: true,
		type: 'options',
		default: 'WORD',
		description: 'Type of the document to create',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Word Document',
				value: 'WORD',
			},
			{
				name: 'Excel Spreadsheet',
				value: 'EXCEL',
			},
			{
				name: 'PowerPoint Presentation',
				value: 'POWERPOINT',
			},
		],
		routing: {
			send: {
				property: 'dokumenttyp',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Folder',
		name: 'folderId',
		type: 'resourceLocator',
		required: true,
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getFolders',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Folder ID',
			},
		],
		routing: {
			send: {
				property: 'ordnerId',
				type: 'body',
			},
		},
	},
	{
		displayName: 'Letterhead Template',
		name: 'letterheadTemplateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
				documentType: ['WORD'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getDocumentTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Letterhead Template ID',
			},
		],
		routing: {
			send: {
				preSend: [
					async function (this, requestOptions) {
						const templateParam = this.getNodeParameter(
							'templateId',
							{},
						) as INodeParameterResourceLocator;
						const templateId = templateParam?.value;

						const letterheadTemplateParam = this.getNodeParameter(
							'letterheadTemplateId',
							{},
						) as INodeParameterResourceLocator;
						const letterheadTemplateId = letterheadTemplateParam?.value;

						if (letterheadTemplateId && !templateId) {
							throw new NodeOperationError(
								this.getNode(),
								'Template must be specified when using a letterhead template.',
								{ level: 'error' },
							);
						}
						return requestOptions;
					},
				],
				property: 'briefkopf',
				type: 'body',
				value: '={{ $value && $value !== "" ?  { id: $value } : undefined }}',
			},
		},
	},
	{
		displayName: 'Template',
		name: 'templateId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getDocumentTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'Enter Template ID',
			},
		],
		routing: {
			send: {
				property: 'vorlage',
				type: 'body',
				value: '={{ $value && $value !== "" ?  { id: $value } : undefined }}',
			},
		},
	},
	{
		displayName: 'Office Location',
		name: 'officeLocationId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		description: 'Select the office location to use for document creation',
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: {
					searchListMethod: 'getOfficeLocations',
					searchable: false,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
			},
		],
		routing: {
			send: {
				property: 'standort',
				type: 'body',
				value: '={{ $value.value && $value.value !== "" ? { id: $value.value } : undefined }}',
			},
		},
	},
	{
		displayName: 'Template Placeholders',
		name: 'templatePlaceholders',
		type: 'fixedCollection',
		placeholder: 'Add Template Placeholder',
		default: {},
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
				documentType: ['WORD'],
			},
		},
		options: [
			{
				name: 'placeholders',
				displayName: 'Placeholders',
				values: [
					{
						displayName: 'Placeholder Name',
						name: 'placeholderName',
						type: 'string',
						default: '',
						description: 'Name of the placeholder in the template',
					},
					{
						displayName: 'Placeholder Value',
						name: 'placeholderValue',
						type: 'string',
						default: '',
						description: 'Value to replace the placeholder with',
					},
				],
			},
		],
		routing: {
			send: {
				property: 'platzhalter',
				type: 'body',
				value:
					'={{ Array.isArray($value?.placeholders) ' +
					'? $value.placeholders' +
					"    .filter(p => (p?.placeholderName ?? '').trim() && (p?.placeholderValue ?? '').trim())" +
					'    .reduce((obj, p) => {' +
					"      obj[(p.placeholderName ?? '').trim()] = (p.placeholderValue ?? '').trim();" +
					'      return obj;' +
					'    }, {})' +
					': {} }}',
			},
		},
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				operation: ['create'],
				resource: ['document'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Typ',
				name: 'typ',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'beschreibung',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
			},
		],
		routing: {
			send: {
				property: 'details',
				type: 'body',
				value: '={{ $value && Object.keys($value).length ? $value : undefined }}',
			},
		},
	},
];
