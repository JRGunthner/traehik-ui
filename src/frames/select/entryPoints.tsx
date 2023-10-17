import {SelectMany, SO} from "comps";

export type EntryPointsType = "web" | "websecure";

const optionsEntryPoints: SO[] = [
    {valor: "web", titulo: "web"},
    {valor: "websecure", titulo: "websecure"}
];

interface Props {
    valores: string[];
    onChange: (valor: EntryPointsType[]) => void;
}

export function SelectEntryPoints(p: Props) {
    return (
        <SelectMany
            options={optionsEntryPoints}
            valores={p.valores}
            onChange={v => p.onChange(v)}/>
    );
}
