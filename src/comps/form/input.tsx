import {KeyboardEvent} from "react";

interface Props {
    valor: string;
    disabled?: boolean;
    onChange?: (valor: string) => void;
    autoFocus?: boolean;
    onEnter?: () => void;
}

export function Input(p: Props) {

    function onChange(valor: string) {
        p.onChange(valor);
    }

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if ((e.code === "Enter") && (p.onEnter))
            p.onEnter();
    }

    return (
        <input autoFocus={p.autoFocus} value={p.valor} type={"text"}
               className={"form-control"}
               style={{height: "38px"}}
               onKeyDown={onKeyDown}
               onChange={(e) => {
                   onChange(e.target.value);
               }} disabled={p.disabled}/>
    );
}
