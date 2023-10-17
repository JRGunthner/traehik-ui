import {Icone} from "comps";
import css from "./botao.module.scss";

interface Props {
    onClick?: () => void;
    disabled?: boolean;
    icone?: string;
    tipo?: Botao.Tipo;
    children: string;
}

export function Botao(p: Props) {
    let clazz = [
        "btn",
        css.btn,
        p.tipo || Botao.Tipo.sec,
    ];

    return (
        <button
            onClick={p.onClick}
            disabled={p.disabled}
            className={clazz.join(" ")}>
            {p.icone && <Icone nome={p.icone}/>}
            {p.children}
        </button>
    );
}

export module Botao {
    export const enum Tipo {
        pri = "btn-primary",
        sec = "btn-secondary",
        dan = "btn-danger"
    }
}
