import {SelectOne, SO} from "comps";
import {useConfig} from "context/config";

interface Props {
    valor: string;
    onChange: (valor: string) => void;
}

export function SelectService(p: Props) {
    const {depois} = useConfig();

    function optionsService(): SO<string>[] {
        const chavesServices = Object.keys(depois.http.services);
        const options: SO[] = chavesServices.map(e => {
            return {valor: e, titulo: e};
        });
        options.push({valor: "api@internal", titulo: "api@internal"});

        return options;
    }

    return (
        <SelectOne
            options={optionsService()}
            valor={p.valor}
            onChange={v => p.onChange(v)}/>
    );
}
