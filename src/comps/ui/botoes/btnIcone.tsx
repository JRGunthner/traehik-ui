import css from "./botao.module.scss";
import {Icone} from "comps/ui/icone";
import {Tooltip} from "comps/ui/tooltip";
import React from "react";
import Link from "next/link";

interface Props {
    nome: string;
    children?: string;
    onClick?: () => void;
    cor?: Icone.Cor;
    link?: string;
}

export function BtnIcone(p: Props) {
    function btn() {
        return <button className={`btn btn-secondary ${css.btnIcone}`} onClick={p.onClick}>
            <Icone nome={p.nome} cor={p.cor || Icone.Cor.light}/>
        </button>;
    }

    function renderButton() {
        return p.link ? <Link target="_blank" href={p.link}>{btn()}</Link> : btn();
    }

    return p.children ? <Tooltip titulo={p.children}>{renderButton()}</Tooltip> : renderButton();
}
