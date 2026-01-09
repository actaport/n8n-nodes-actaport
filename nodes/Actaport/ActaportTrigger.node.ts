import {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
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

				this.logger?.debug?.('[ActaportTrigger] Checking existing Actaport webhooks...');

				let responseData: ActaportWebhook[];

				try {
					responseData = (await actaportApiRequestGetAllPaginatedItems.call(this, '/webhooks', {
						limit: 25,
					})) as ActaportWebhook[];

					this.logger?.info('Got number of existing webhooks: ' + responseData.length);
				} catch (error) {
					this.logger?.error?.(
						`[ActaportTrigger] Failed to fetch existing webhooks: ${(error as Error).message}`,
					);
					return false;
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

				this.logger?.info?.(
					`[ActaportTrigger] Creating webhook for events [${events.join(', ')}] → ${hookUrl}`,
				);

				try {
					const response = (await actaportApiRequest.call(this, 'POST', '/webhooks', {
						events,
						hookUrl,
						description: `n8n Actaport Trigger [${events.join(', ')}]`,
					})) as ActaportWebhook;

					if (!response?.id) {
						this.logger?.warn?.('[ActaportTrigger] No subscription ID returned');
						return false;
					}

					staticData.subscription = { id: response.id, events };
					this.logger?.info?.(`[ActaportTrigger] Subscribed successfully (ID: ${response.id})`);
					return true;
				} catch (error) {
					this.logger?.error?.(
						`[ActaportTrigger] Failed to create webhook: ${(error as Error).message}`,
					);
					return false;
				}
			},

			/**
			 * Called when the workflow is deactivated → unregister webhook
			 */
			async delete(this: IHookFunctions): Promise<boolean> {
				const staticData = getStaticData(this);
				const subscription = staticData.subscription;

				if (!subscription?.id) {
					this.logger?.info?.('[ActaportTrigger] No existing subscription to delete');
					return true;
				}

				try {
					await actaportApiRequest.call(this, 'DELETE', `/webhooks/${subscription.id}`);
					this.logger?.info?.(`[ActaportTrigger] Deleted webhook (ID: ${subscription.id})`);
					delete staticData.subscription;
					return true;
				} catch (error) {
					this.logger?.error?.(
						`[ActaportTrigger] Failed to delete webhook: ${(error as Error).message}`,
					);
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
		this.logger?.info?.('[ActaportTrigger] Incoming webhook event received');
		return { workflowData: [[{ json: bodyData }]] };
	}
}
