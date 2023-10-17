import css from "./tabela.module.scss";
import {isValidElement, useEffect, useState} from "react";
import {Icone} from "comps";

export declare module Tabela {
    interface Coluna {
        titulo?: string | JSX.Element;
        hidden?: boolean;
        tipo?: "icone" | "int";
        align?: "left" | "center" | "right";
        sufix?: string;
    }

    interface Linha {
        cor?: string;
        ativo?: boolean;
        doubleClick?: () => void;
        item?: any;
        key: number;
        valores: any[];
        view?: any[];
        filtro?: string;
    }

    interface Status {
        linhas: Linha[];
        key1th: number;
    }
}

type COL = Tabela.Coluna;

interface Props {
    onClick?: (key: number) => void;
    colunas: Tabela.Coluna[];
    linhas: Tabela.Linha[];
    foot?: any[];
    filtro?: string;
    onStatus?: (status: Tabela.Status) => void;
    paginacao?: boolean;
}

interface IOrd {
    coluna: number;
    asc: boolean;
}

class Ordenador {
    constructor(private asc: boolean) {
    }
    isNumber(a: number, b: number) {
        return typeof a === "number" && typeof b === "number";
    }

    isString(a: string, b: string) {
        return typeof a === "string" && typeof b === "string";
    }

    isJSX(a: any, b: any) {
        return (isValidElement(a) && isValidElement(b));
    }

    ordenaNumber(a: number, b: number) {
        return this.asc ? a - b : b - a;
    }

    ordenaString(a: string, b: string) {
        return this.asc ? a.localeCompare(b) : b.localeCompare(a);
    }

    ordenaJSX(a: any, b: any) {
        const x = a.props["data-valor"];
        const y = b.props["data-valor"];

        if (this.isNumber(x, y)) {
            return this.ordenaNumber(x, y);
        }

        if (this.isString(x, y)) {
            return this.ordenaString(x, y);
        }
        return 0;
    }

    ordenar(a: any, b: any): number {
        if (this.isNumber(a, b)) {
            return this.ordenaNumber(a, b);
        }
        if (this.isString(a, b)) {
            return this.ordenaString(a, b);
        }
        if (this.isJSX(a, b)) {
            return this.ordenaJSX(a, b);
        }
        return 0;
    }
}

export function Tabela(p: Props) {
    const [index, setIndex] = useState<any>(null);
    const [ord, setOrd] = useState<IOrd>({coluna: -1, asc: false});
    const [linhas, setLinhas] = useState<Tabela.Linha[]>([]);

    function selecionar(e: Tabela.Linha) {
        setIndex(e);
        if (p.onClick) {
            p.onClick(e.key);
        }
    }

    if (ord.coluna >= 0) {
        const ordenador = new Ordenador(ord.asc);
        p.linhas.sort((a, b) => {
            const x = a.valores[ord.coluna] || 0;
            const y = b.valores[ord.coluna] || 0;
            if (x === y) {
                return a.key - b.key;
            }
            return ordenador.ordenar(x, y);
        });
    }

    function getIcone(nome: string): string {
        const icone = {
            tls: "fa-shield",
        };
        return icone[nome] || "";
    }

    function getIconeCor(nome: string): Icone.Cor {
        if (nome === "tls") {
            return Icone.Cor.success;
        }
    }

    function getAlign(coluna: COL): "left" | "center" | "right" {
        if (coluna?.tipo === "int") {
            return "right";
        }
        if (coluna?.tipo === "icone") {
            return "center";
        }
        return coluna?.align || "left";
    }

    function alteraOrdem(i: number) {
        setOrd({
            coluna: i,
            asc: i === ord.coluna ? !ord.asc : ord.asc,
        });
    }

    function filtrarLinhas(): Tabela.Linha[] {
        if (!p.filtro) {
            return p.linhas;
        }
        const words = p.filtro.toLowerCase().split(" ");
        return p.linhas.filter(e => {
            return words.every(w => e.filtro.includes(w));
        });
    }

    useEffect(() => {
        p.linhas.forEach(linha => {
            linha.view = linha.valores.map((e, i) => td(e, i));
            linha.filtro = linha.valores
                .join(" ")
                .toLowerCase();
        });
        const linhas = filtrarLinhas();
        setLinhas(linhas);
    }, [p.linhas]);

    function renderValue(valor: any, coluna: COL): any {
        switch (coluna?.tipo) {
            case "icone":
                return <Icone nome={getIcone(valor)} cor={getIconeCor(valor)}/>;
            case "int":
                return coluna.sufix ? valor + " " + coluna.sufix : valor;
            default:
                return valor;
        }
    }

    function td(v: any, i: number) {
        const coluna = p.colunas[i];
        if (coluna?.hidden) {
            return null;
        }
        return (
            <td style={{textAlign: getAlign(coluna)}} key={i}>
                {renderValue(v, coluna)}
            </td>
        );
    }

    function tbody() {
        return (
            linhas.map(e => {
                if (!e.view) {
                    return;
                }
                return (
                    <tr
                        style={{color: e.cor}}
                        key={e.key}
                        onClick={() => selecionar(e)}
                        onAuxClick={() => selecionar(e)}
                        className={`${e.ativo === false && css.desativo} ${index?.key == e.key ? "bg-success bg-opacity-25" : ""}`}
                        onDoubleClick={e.doubleClick}
                    >{e.view}</tr>
                );
            }));
    }

    function thead() {
        return (
            <tr>
                {p.colunas.map((e, i) => {
                    if (e.hidden) {
                        return null;
                    }
                    const coluna = p.colunas[i];
                    return (
                        <th key={i} onClick={() => alteraOrdem(i)}>
                            <div style={{justifyContent: getAlign(coluna)}}
                                 className={"d-flex align-items-center gap-1"}>
                                {e.titulo}{i === ord.coluna &&
                                <Icone nome={ord.asc ? "fa-arrow-down-a-z" : "fa-arrow-up-a-z"}/>}
                            </div>
                        </th>
                    );
                })}
            </tr>
        );
    }

    function tfoot() {
        return (
            <tr>
                {p.foot.map((e, i) =>
                    <td key={i}> {e}</td>,
                )}
            </tr>
        );
    }

    useEffect(() => {
        if (p.onStatus) {
            p.onStatus({linhas: linhas, key1th: linhas.length === 1 ? linhas[0].key : null});
        }
    }, [p.filtro, p.linhas.length]);

    return (
        <div className="d-flex flex-column w-100">
            <div className={css.tabela}>
                <table className={"table table-hover"}>
                    <thead>{thead()}</thead>
                    <tbody>{tbody()}</tbody>
                    {p.foot && <tfoot>{tfoot()}</tfoot>}
                </table>
            </div>
        </div>
    );
}
