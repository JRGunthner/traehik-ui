import SelectReact from "react-select";
import React, {useId} from "react";

interface Option {
    value: string;
    label: string;
}

// select options
export interface SO<T = any> {
    valor: T;
    titulo: string;
}

interface Props {
    options: SO[];
    valores: any[];
    onChange: (valores: any[]) => void;
    isMulti?: boolean;
}

function Select(p: Props) {
    function onChange(values: Option | Option[]) {
        if (Array.isArray(values))
            p.onChange(values.map(e => e.value));
        else
            p.onChange([values.value]);
    }

    const options: Option[] = p.options.map(e => ({
        value: e.valor,
        label: e.titulo,
    }));

    const values = options.filter(e => p.valores.indexOf(e.value) >= 0);

    return <SelectReact instanceId={useId()} className={"w-100"} isMulti={p.isMulti} value={values}
                        onChange={onChange}
                        placeholder="Selecione..."
                        noOptionsMessage={({inputValue}) =>
                            <span>Nenhum opção encontrada para o termo: {inputValue}</span>}
                        options={options}/>;
}

interface PropsMany<T> {
    options: SO<T>[];
    valores: T[];
    onChange: (valores: T[]) => void;
}

export function SelectMany<T>(p: PropsMany<T>) {
    return <Select
        options={p.options}
        valores={p.valores}
        onChange={p.onChange}
        isMulti
    />;
}

interface PropsOne<T> {
    options: SO<T>[];
    valor: T;
    onChange: (valor: T) => void;
}

export function SelectOne<T>(p: PropsOne<T>) {
    return <Select
        options={p.options}
        valores={[p.valor]}
        onChange={v => p.onChange(v[0])}
    />;
}
