import css from "./acao.module.scss";

interface Props {
    titulo?: string;
    desc?: string;
    flex?: number;
    children: any;
}

export function Acao(p: Props) {
    let dica;
    let children = p.children;

    if (Array.isArray(p.children)) {
        dica = p.children.find(e => e.type.name === "Dica");
        children = p.children.filter(e => e !== dica);
    }

    return (
        <div className={`col-${p.flex}`}>
            <div className={"d-flex align-items-center gap-2"}>
                <b className={css.label}>{p.titulo ? p.titulo : <br/>}</b>
                {dica}
            </div>
            {children}
            {p.desc && <small className={"form-text"}>{p.desc}</small>}
        </div>
    );
}
