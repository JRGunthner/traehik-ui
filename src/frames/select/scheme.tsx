import {SelectOne, SO} from "comps";

interface Props {
    valor: string;
    onChange: (valor: string) => void;
}

export function SelectScheme(p: Props) {
    const optionsScheme: SO[] = [
        {valor: "https", titulo: "https"},
        {valor: "http", titulo: "http"},
    ];

    return (
        <SelectOne
            options={optionsScheme}
            valor={p.valor}
            onChange={v => p.onChange(v)}/>
    );
}
