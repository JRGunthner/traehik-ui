import {SelectMany, SO} from "comps";
import {useConfig} from "context/config";

interface Props {
    valores: string[];
    onChange: (valor: string[]) => void;
}

export function SelectMiddlewares(p: Props) {
    const {depois} = useConfig();

    function optionsMiddlewares(): SO<string>[] {
        const chavesMiddlewares = Object.keys(depois.http.middlewares);
        return chavesMiddlewares.map(e => {
            return {valor: e, titulo: e};
        });
    }

    return (
        <SelectMany
            options={optionsMiddlewares()}
            valores={p.valores}
            onChange={v => p.onChange(v)}/>
    );
}
