import css from "./content.module.scss";

interface Props {
    children: JSX.Element | JSX.Element[];
    visible?: boolean;
    overflow?: boolean;
    altura?: string;
    flex?: boolean;
}

export function Content(p: Props) {
    const clazz = `${p.flex ? "row gx-2" : "gap-2"} ${css.content} ${p.visible === false ? "d-none" : ""} ${p.overflow ? " overflow" : ""}`.trim();

    return (
        <div
            className={clazz}
            style={{height: p.altura}}>
            {p.children}
        </div>
    );
}
