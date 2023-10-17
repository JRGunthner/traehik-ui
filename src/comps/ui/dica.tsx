import {Icone, Tooltip} from "comps";

interface Props {
    children: string;
    posicao?: Tooltip.Posicao;
    tamanho?: Icone.Tamanho;
}

export function Dica(p: Props) {

    return (
        <Tooltip titulo={p.children} posicao={p.posicao}>
            <i className={"fa fa-circle-info"} style={{color: Icone.Cor.primary, fontSize: p.tamanho}}/>
        </Tooltip>
    );
}
