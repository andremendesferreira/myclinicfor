"use client"

import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import { msgSuccess, msgError, msgWarning, msgInfo } from '@/components/custom-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
  TooltipArrow
} from "@/components/ui/tooltip";

interface ButtonCopyLinkProps {
    msgInf?: string,
    msgErr?: string,
    url: string | '',
    styleBt?: string,
    tooltipMsg?: string,
    tooltipStyleBx?: string,
    tooltipStyleAw?: string,
}

export function ButtonCopyLink({ url, msgInf, msgErr, styleBt, tooltipMsg, tooltipStyleBx, tooltipStyleAw }: ButtonCopyLinkProps) {

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
        <TooltipProvider >
            <Tooltip >
                <TooltipTrigger asChild>
                    <Button
                        className={`${styleBt}`}
                        onClick={url !== '' ? () => handleCopyLink( { url:url, msgInf: msgInf || undefined } ) :
                        () => handleAlerta(msgErr || '')}
                    >
                        <LinkIcon className="w-5! h-5!"/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent  className={`${tooltipStyleBx}`}>
                    <p>{tooltipMsg}</p>
                    <TooltipArrow className={`${tooltipStyleAw}`} />
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}