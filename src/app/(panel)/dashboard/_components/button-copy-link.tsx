"use client"

import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { msgSuccess, msgError, msgWarning, msgInfo } from '@/components/custom-toast';

interface ButtonCopyLinkProps {
    msgInf?: string,
    msgErr?: string,
    url: string | '',
    styleBt?: string,
}

export function ButtonCopyLink({ url, msgInf, msgErr, styleBt }: ButtonCopyLinkProps) {

    async function handleCopyLink({ url, msgInf }: ButtonCopyLinkProps){
        await navigator.clipboard.writeText(url);
        const message = msgInf && msgInf !== '' ? msgInf : "Link copiado com sucesso.";
        msgInfo(message);
    }

    function handleAlerta(msgErr: string | undefined){
        const message = msgErr && msgErr !== '' ? msgErr : "Falha ao tentar copiar link.";
        msgError(message);
    }

    return(
        <Button
            className={`${styleBt}`}
            onClick={url !== '' ? () => handleCopyLink( { url:url, msgInf: msgInf || undefined } ) :
             () => handleAlerta(msgErr || '')}
        >
            <LinkIcon className="w-5! h-5!"/>
        </Button>
    )
}