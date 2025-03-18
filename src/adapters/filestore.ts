import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utilities/logger';

interface UploadFileResponse {
    bucket?: string
    file_name?: string,
    file_path?: string
}

export const FileStore = {
    UploadFile: async (file: any) => {
        const filename = encodeURI(uuidv4())
        const formData = new FormData();
        formData.append('BUCKET', Bun.env.BUCKETNAME!);
        const fileBlob = new Blob([file]);
        formData.append('FILES', fileBlob, filename);
        try {
            const response = await fetch('http://10.150.1.88:3047/api/v1/file/upload', {
                method: 'POST',
                body: formData,
                headers: { 'x-api-key': Bun.env.FILESTOREKEY! },
            });
            // console.log(response);
            (response)
            if (response.ok) {
                let json = await response.json();
                if (json.status == true) {
                    const reponsedata: UploadFileResponse = {
                        ...json.data
                    }
                    return reponsedata;
                } else {
                    console.error(json.message);
                    return null;
                }
            } else {
                logger.Error(response)
            }

        } catch (error) {
            console.error('Error during file upload:', error);
        }
    },

    DeleteFile: async (filename: string) => {
        const payload = {
            bucket: Bun.env.BUCKETNAME,
            file_name: filename
        }
        try {
            const response = await fetch('http://10.150.1.88:3047/api/v1/file/upload', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: { 'x-api-key': Bun.env.FILESTOREKEY! },
            });
            let json = await response.json();
            if (json.status == true) {
                return json.data;
            } else {
                console.log(json.message);
                return '';
            }

        } catch (error) {
            console.error('Error during file upload:', error);
        }
    }
}