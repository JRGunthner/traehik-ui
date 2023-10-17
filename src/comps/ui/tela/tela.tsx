import css from "./tela.module.scss";
import {ReactNode} from "react";

interface Props {
    children: ReactNode;
}

export function Tela(p: Props) {

    return (
        <div className={"overflow " + css.tela}>
            {p.children}
        </div>
    );
}
