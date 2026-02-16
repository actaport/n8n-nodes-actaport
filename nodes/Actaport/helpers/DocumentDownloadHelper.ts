import { IExecuteSingleFunctions, IN8nHttpFullResponse, INodeExecutionData } from 'n8n-workflow';

export async function returnBinaryData(
	this: IExecuteSingleFunctions,
	items: INodeExecutionData[],
	responseData: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	let fileName = 'blob.bin';

	const contentDisposition = responseData.headers['content-disposition'] as string | undefined;
	if (contentDisposition) {
		const utf8Regex = /filename\*=\s*utf-8''([^;]+)/i;
		const utf8Match = utf8Regex.exec(contentDisposition);
		if (utf8Match?.[1]) {
			try {
				fileName = decodeURIComponent(utf8Match[1]);
			} catch {
				fileName = utf8Match[1];
			}
		} else {
			const filenameRegex = /filename\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s;]+))/i;
			const filenameMatch = filenameRegex.exec(contentDisposition);
			if (filenameMatch) {
				fileName = (filenameMatch[1] || filenameMatch[2] || filenameMatch[3] || '').replace(
					/['"]/g,
					'',
				);
			}
		}
	}

	const mimeType = (responseData.headers['content-type'] as string) || 'application/octet-stream';

	const binaryData = await this.helpers.prepareBinaryData(
		responseData.body as Buffer,
		fileName,
		mimeType,
	);

	return items.map(() => ({ json: responseData.headers, binary: { ['data']: binaryData } }));
}
