import {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	NodeApiError,
} from 'n8n-workflow';

function getExtension(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	return lastDot > 0 ? fileName.slice(lastDot) : '';
}

function stripExtension(fileName: string): string {
	const lastDot = fileName.lastIndexOf('.');
	return lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
}

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;

export async function preSendUpload(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', 'data') as string;

	const options = this.getNodeParameter('options', {}) as IDataObject;

	const binaryData = this.helpers.assertBinaryData(binaryPropertyName);

	const fileBuffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

	const mimeType = binaryData.mimeType || 'application/octet-stream';
	const originalFileName = binaryData.fileName || 'document';
	const originalExt = getExtension(originalFileName);
	const customName = typeof options.documentName === 'string' ? options.documentName.trim() : '';

	if (fileBuffer.length === 0) {
		throw new NodeApiError(this.getNode(), {
			message: 'The binary data is empty. Please check the input data.',
		});
	}

	if (fileBuffer.length > MAX_UPLOAD_SIZE) {
		this.logger?.info('File size exceeds 50 MB limit.');
		throw new NodeApiError(this.getNode(), {
			message: 'The binary data exceeds the maximum allowed size of 50 MB.',
		});
	}

	let finalFileName: string;

	if (customName.length > 0) {
		const baseCustomName = stripExtension(customName);

		finalFileName = originalExt ? `${baseCustomName}${originalExt}` : baseCustomName;
	} else {
		finalFileName = originalFileName;
	}

	const formData = new FormData();

	formData.append('file', new Blob([fileBuffer], { type: mimeType }), finalFileName);

	const folderName = typeof options.folderName === 'string' ? options.folderName.trim() : '';

	if (folderName.length > 0) {
		formData.append('ordner', folderName);
	}

	requestOptions.body = formData;

	return requestOptions;
}
