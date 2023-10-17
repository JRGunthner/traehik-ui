import {CSSProperties} from "react";

interface Props {
    valor: string;
    disabled?: boolean;
    onChange?: (valor: string) => void;
    style?: CSSProperties;
}

export function TextArea(p: Props) {

    function onChange(valor: string) {
        p.onChange && p.onChange(valor);
    }

    function onBlur(valor: string) {
        p.onChange && p.onChange(valor.trim());
    }

    return (
        <div className={"d-flex position-relative"}>
                   <textarea
                       onBlur={(e) => onBlur(e.target.value)}
                       value={p.valor}
                       onChange={(e) => onChange(e.target.value)}
                       className="form-control text-nowrap"
                       style={{resize: "none", minHeight: "150px", ...p.style}}
                   />
        </div>
    );
}
