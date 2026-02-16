import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeApiError,
} from 'n8n-workflow';

import {
	actaportApiRequest,
	actaportApiRequestGetAllPaginatedItems,
	getStaticData,
} from './GenericFunctions';

import { ActaportWebhook, ACTAPORT_EVENT_OPTIONS } from './ActaportTypes';

export class ActaportTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Actaport Trigger',
		name: 'actaportTrigger',
		group: ['trigger'],
		version: 1,
		description: 'Triggers the workflow when an event occurs in Actaport',
		icon: 'file:actaport.svg',
		usableAsTool: true,
		defaults: {
			name: 'Actaport Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'actaportOAuth2Api',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				responseMode: 'onReceived',
				httpMethod: 'POST',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: ACTAPORT_EVENT_OPTIONS,
				default: [],
				required: true,
				description: 'Select which event types to listen for',
			},
		],
	};

	webhookMethods = {
		default: {
			/**
			 * Check whether an existing webhook subscription already exists
			 */
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') ?? '';
				const trimmedWebhookUrl = webhookUrl.trim();
				const events = this.getNodeParameter('events') as string[];

				let responseData: ActaportWebhook[];

				try {
					responseData = (await actaportApiRequestGetAllPaginatedItems.call(this, '/webhooks', {
						limit: 25,
					})) as ActaportWebhook[];
				} catch (error) {
					throw new NodeApiError(this.getNode(), {
						message: 'Error while fetching existing webhooks',
						description: error instanceof Error ? error.message : 'Unknown error',
					});
				}

				for (const webhook of responseData) {
					const sameUrl = webhook.hookUrl?.trim() === trimmedWebhookUrl;
					const sameEvents =
						Array.isArray(webhook.events) &&
						webhook.events.length === events.length &&
						webhook.events.every((e) => events.includes(e));

					if (sameUrl && sameEvents) {
						const staticData = getStaticData(this);
						staticData.subscription = { id: webhook.id, events: webhook.events };
						return true;
					}
				}

				return false;
			},

			/**
			 * Called when the workflow is activated → registers webhook
			 */
			async create(this: IHookFunctions): Promise<boolean> {
				const events = this.getNodeParameter('events', []) as string[];
				const hookUrl = this.getNodeWebhookUrl('default');
				const staticData = getStaticData(this);

				try {
					const response = (await actaportApiRequest.call(this, 'POST', '/webhooks', {
						events,
						hookUrl,
						description: `n8n Actaport Trigger [${events.join(', ')}]`,
					})) as ActaportWebhook;
					if (!response?.id) {
						return false;
					}

					staticData.subscription = { id: response.id, events };
					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), {
						message: 'Error while creating webhook subscription',
						description: error instanceof Error ? error.message : 'Unknown error',
					});
				}
			},

			/**
			 * Called when the workflow is deactivated → unregister webhook
			 */
			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = getStaticData(this);
				const subscription = staticData.subscription;

				if (!subscription?.id) {
					return true;
				}

				try {
					await actaportApiRequest.call(this, 'DELETE', `/webhooks/${subscription.id}`);
					delete staticData.subscription;
					return true;
					// Catch errors but return false to avoid blocking workflow deactivation
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					return false;
				}
			},
		},
	};

	/**
	 * Handles incoming webhook events
	 */
	async webhook(this: IWebhookFunctions) {
		const bodyData = this.getBodyData();
		return { workflowData: [[{ json: bodyData }]] };
	}
}
