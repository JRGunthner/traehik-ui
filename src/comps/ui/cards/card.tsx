import css from "./card.module.scss";
import {Card as CardRB} from "react-bootstrap/";
import {useState} from "react";
import {Icone} from "comps/ui/icone";
import {Tooltip} from "comps/ui/tooltip";

interface Props {
    titulo: string;
    children: JSX.Element[] | JSX.Element;
    setEdicao?: (valor: boolean) => void;
}

export function Card(p: Props) {
    const [editar, setEditar] = useState(false);

    function onMouseEnter() {
        setEditar(true);
    }

    function onMouseLeave() {
        setEditar(false);
    }

    return (
        <CardRB className={css.card} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <CardRB.Body>
                <div className={`d-flex justify-content-between ${css.header}`}>
                    <CardRB.Title>:: {p.titulo}</CardRB.Title>
                    {p.setEdicao && <Tooltip titulo={"Editar"}>
                        <Icone nome={"fa-pen"} tamanho={Icone.Tamanho.md} onClick={() => p.setEdicao(true)} data-show={editar}/>
                    </Tooltip>}
                </div>
                {p.children}
            </CardRB.Body>
        </CardRB>
    );
}

export default Card;
