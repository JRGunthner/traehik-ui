import Form from "react-bootstrap/Form";
import {useId} from "react";

interface Props {
    titulo: string;
    valor: boolean;
    onChange?: (valor: boolean) => void;
    disabled?: boolean;
}

export function Switch(p: Props) {
    function onChange() {
        p.onChange(!p.valor);
    }

    return (
        <Form.Switch disabled={p.disabled} onChange={onChange} label={p.titulo} id={useId()}
                     checked={p.valor}/>
    );
}
