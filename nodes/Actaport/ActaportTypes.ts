import { INodePropertyOptions } from 'n8n-workflow';

export interface ActaportPage<T> {
	content?: T[] | [];
	first?: boolean;
	last?: boolean;
	totalElements?: number;
	totalPages?: number;
	size?: number;
	number?: number;
	_link?: {
		next?: {
			href: string;
		};
		prev?: {
			href: string;
		};
	};
}

export interface ActaportWebhook {
	id: string;
	events: string[];
	hookUrl: string;
	description?: string;
}

export interface ActaportStaticData {
	subscription?: {
		id: string;
		events: string[];
	};
}

export const ACTAPORT_EVENT_OPTIONS: INodePropertyOptions[] = [
	{ name: 'Case File Created', value: 'akte.created' },
	{ name: 'Case File Updated', value: 'akte.changed' },
	{ name: 'Contact Created', value: 'kontakt.created' },
	{ name: 'Contact Updated', value: 'kontakt.changed' },
	{ name: 'Deadline Created', value: 'frist.created' },
	{ name: 'Deadline Updated', value: 'frist.changed' },
	{ name: 'Document Created', value: 'document.created' },
	{ name: 'Document Updated', value: 'document.changed' },
	{ name: 'Invoice Created', value: 'rechnung.created' },
	{ name: 'Invoice Updated', value: 'rechnung.changed' },
	{ name: 'User Created', value: 'benutzer.created' },
	{ name: 'User Updated', value: 'benutzer.changed' },
];
