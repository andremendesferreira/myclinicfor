// Exemplo de um componente Client Component que usa ButtonTooltip
"use client";

import { ButtonTooltip } from '@/components/ui/button-tooltip';

interface ButtonCopyLinkProps {
    className?: string;
    tooltipMsg?: string;
    tooltipStyleBox?: string;
    tooltipStyleArrow?: string;
    icon?: React.ReactNode;
    iconStyle?: string;
    textButtonInner?: string;
    textButtonStyle?: string;
    onClick?:React.MouseEventHandler<HTMLButtonElement>

}

export function ButtonTooltipCustom({
    className, tooltipMsg, tooltipStyleBox,
    tooltipStyleArrow, icon, iconStyle,
    textButtonInner, textButtonStyle, onClick

}:ButtonCopyLinkProps) {
    return (
        <ButtonTooltip 
            className={className}
            tooltipMsg={tooltipMsg}
            tooltipStyleBox={tooltipStyleBox}
            tooltipStyleArrow={tooltipStyleArrow}
            icon={icon}
            iconStyle={iconStyle}
            textButtonInner={textButtonInner}
            textButtonStyle={textButtonStyle}
            onClick={onClick?.call}
            asChild={false}
        />
    );
}