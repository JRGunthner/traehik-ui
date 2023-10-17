import {OverlayTrigger, Tooltip as TooltipRB} from "react-bootstrap";

interface Props {
    titulo: string;
    posicao?: Tooltip.Posicao;
    children: JSX.Element | JSX.Element[];
}

export function Tooltip(p: Props) {
    const renderTooltip = props => (
        <TooltipRB {...props}>
            {p.titulo}
        </TooltipRB>
    );

    return (
        <OverlayTrigger
            placement={p.posicao || Tooltip.Posicao.baixo}
            overlay={renderTooltip}>
            <div>
                {p.children}
            </div>
        </OverlayTrigger>
    );
}

export module Tooltip {
    export const enum Posicao {
        cima = "top",
        baixo = "bottom",
        esquerda = "left",
        direita = "right",
    }
}
