import type { Icon, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class ActaportOAuth2Api implements ICredentialType {
	name = 'actaportOAuth2Api';
	displayName = 'Actaport OAuth2 API';
	extends = ['oAuth2Api'];

	documentationUrl = 'https://api.actaport.de/api-docs/rest-api/introduction/authentication';

	icon: Icon = {
		light: 'file:../nodes/Actaport/actaport.light.svg',
		dark: 'file:../nodes/Actaport/actaport.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Realm',
			name: 'realm',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'Realm',
			description: 'Actaport realm name acquired over your subscription.',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '={{ "https://app.actaport.de/auth/realms/" + $self["realm"] + "/protocol/openid-connect/auth" }}',
			description: 'Authorization endpoint',
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{ "https://app.actaport.de/auth/realms/" + $self["realm"] + "/protocol/openid-connect/token" }}',
			description: 'Token endpoint',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'openid offline_access',
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'hidden',
			default: 'automation',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'hidden',
			default: '',
			typeOptions: { password: true },
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'pkce',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.actaport.de/v1',
			url: '/info/me',
			method: 'GET',
		},
	};
}
