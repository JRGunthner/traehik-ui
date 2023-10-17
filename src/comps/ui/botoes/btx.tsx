import {Botao} from "comps";

type Titulos =
    | "salvar"
    | string;

interface Props {
    children: Titulos;
    onClick?: (setTrue: boolean) => void;
    disabled?: boolean;
}

export function Btx(p: Props) {
    function renderTipo(): Botao.Tipo {
        const pri: Titulos[] = ["salvar"];
        if (pri.indexOf(p.children) >= 0)
            return Botao.Tipo.pri;

        const dan: Titulos[] = ["excluir"];
        if (dan.indexOf(p.children) >= 0)
            return Botao.Tipo.dan;

        return Botao.Tipo.sec;
    }

    function renderIcone(): string {
        const iconeBotao: { [index: Titulos]: string } = {
            salvar: "fa-save",
            editar: "fa-pen",
            adicionar: "fa-circle-plus",
            middlewares: "fa-layer-group",
            routes: "fa-globe",
            services: "fa-bolt",
        };

        return iconeBotao[p.children] || "";
    }

    return (
        <Botao disabled={p.disabled} onClick={() => p.onClick ? p.onClick(true) : null} tipo={renderTipo()}
               icone={renderIcone()}>{p.children}</Botao>
    );
}
