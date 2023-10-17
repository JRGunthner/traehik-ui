import {HTMLAttributes} from "react";

interface Props extends HTMLAttributes<HTMLElement> {
    nome: string;
    tamanho?: Icone.Tamanho;
    cor?: Icone.Cor;
}

// utilizando font-awesome versao 6
// link para verificar os icones disponiveis
// https://fontawesome.com/search?q=sort&o=r&s=solid
export function Icone(p: Props) {

    return <i style={{fontSize: p.tamanho, color: p.cor, cursor: p.onClick && "pointer"}}
              className={"fa " + p.nome} {...p}/>;
}

export module Icone {
    export const enum Tamanho {
        xs = "0.5rem",
        sm = "1rem",
        md = "1.5rem",
        lg = "3rem",
        xl = "5.5rem"
    }

    export const enum Cor {
        primary = "#007bff",
        secondary = "#6c757d",
        success = "#28a745",
        info = "#17a2b8",
        warning = "#ffc107",
        danger = "#dc3545",
        light = "#f8f9fa",
        black = "#343a40"
    }
}
