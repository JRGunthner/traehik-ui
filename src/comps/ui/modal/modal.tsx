import css from "./modal.module.scss";
import * as rb from "react-bootstrap";
import {Btx} from "comps/index";

// modal result
export enum MR {
    salvar,
    cancelar,
    excluir,
    fechar
}

interface Props {
    children: any;
    titulo: string;
    onHide: (mr: MR) => void;
    mr: MR[];
    fullscreen?: true | string | "sm-down" | "md-down" | "lg-down" | "xl-down" | "xxl-down";
    size?: "sm" | "lg" | "xl";
}

export function Modal(p: Props) {
    function ifmr(mr: MR): boolean {
        return p.mr.indexOf(mr) >= 0;
    }

    return (

        <rb.Modal show onHide={() => p.onHide(MR.fechar)} size={p.size} fullscreen={p.fullscreen}>
            <rb.Modal.Header className={css.header} closeButton closeVariant={"white"}>
                <rb.Modal.Title>{p.titulo}</rb.Modal.Title>
            </rb.Modal.Header>
            <rb.Modal.Body>
                {p.children}
            </rb.Modal.Body>
            {(p.mr.length > 0) && <rb.Modal.Footer>
                {ifmr(MR.fechar) && <Btx onClick={() => p.onHide(MR.fechar)}>fechar</Btx>}
                <div className={css.botao_excluir}>
                    {ifmr(MR.excluir) && <Btx onClick={() => p.onHide(MR.excluir)}>excluir</Btx>}
                </div>
                {ifmr(MR.cancelar) && <Btx onClick={() => p.onHide(MR.cancelar)}>cancelar</Btx>}
                {ifmr(MR.salvar) && <Btx onClick={() => p.onHide(MR.salvar)}>salvar</Btx>}
            </rb.Modal.Footer>}
        </rb.Modal>
    );
}
