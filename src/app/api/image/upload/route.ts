import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Polyfill para File no Node.js (Next.js 15+)
if (typeof File === 'undefined') {
    global.File = class File extends Blob {
        name: string;
        lastModified: number;
        webkitRelativePath: string;
        
        constructor(fileBits: BlobPart[], fileName: string, options: FilePropertyBag = {}) {
            super(fileBits, options);
            this.name = fileName;
            this.lastModified = options.lastModified || Date.now();
            this.webkitRelativePath = '';
        }
    };
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        const userId = formData.get('userId') as string;

        console.log(file)

        // Verificações de validação primeiro
        if(!userId || userId.trim() === "") {
            return NextResponse.json({ "error": "Falha ao obter o ID do usuário." }, { status: 401 });
        }

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ "error": "Falha ao obter o arquivo." }, { status: 400 });
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB
            return NextResponse.json({ "error": "A imagem deve ter no máximo 2MB." }, { status: 400 });
        }

        if (file.type !== "image/jpeg" && file.type !== "image/png") {
            return NextResponse.json({ "error": "Escolha uma imagem válida do tipo (JPEG ou PNG)." }, { status: 400 });
        }

        // Processamento do arquivo apenas após validações
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        interface CloudinaryResponse {
            secure_url: string;
        }

        const uploadResponse = await new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {   
                    tags: [`userId_${userId}`],
                    public_id: file.name,
                    resource_type: 'auto', 
                    folder: `myclinicSOL/${userId}` 
                },
                (error, result) => {
                    if (error) {
                        console.error('Erro ao tentar enviar o arquivo para o Cloudinary:', error);
                        reject(new Error(error.message));
                    } else {
                        console.log('Imagem carregada com sucesso:', result);
                        resolve(result as CloudinaryResponse);
                    }
                }
            ).end(buffer);
        });

        return NextResponse.json(uploadResponse, { status: 200 });

    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        return NextResponse.json(
            { "error": "Erro interno do servidor ao processar o upload." }, 
            { status: 500 }
        );
    }
}