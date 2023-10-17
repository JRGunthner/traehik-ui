import {useConfig} from "context/config";
import {Btx, Content, Switch, Tabela} from "comps";
import {MiddlewareEdicao, MiddlewareNovo} from "frames";
import {useState} from "react";
import {usePesquisa} from "context/pesquisa";
import {Tela} from "comps/ui/tela/tela";
import {utils} from "services/utils";
import {Middleware} from "lib/types";

export default function TelaMiddlewares() {
    const [novo, setNovo] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [id, setId] = useState(0);
    const {pesquisa} = usePesquisa();
    const {depois} = useConfig();

    if (!depois?.http)
        return;

    function filtrar() {
        const middlewaresArray = Object.entries(depois.http.middlewares).map(([chave, item]) => {
            return {chave, item};
        });
        return middlewaresArray.filter(m => JSON.stringify(m).toLocaleLowerCase().includes(pesquisa.toLocaleLowerCase()));
    }

    const items = filtrar();

    const colunas: Tabela.Coluna[] = [
        {titulo: "Nome"},
        {titulo: "Tipo"},
        {titulo: "Conteúdo"},
    ];

    const linhas: Tabela.Linha[] = items.map((e, i) => ({
        key: i + 1,
        doubleClick: () => {
            setId(i + 1);
            setEdicao(true);
        },
        valores: [
            <div key={i} data-valor={e.chave} className={utils.getBadgeClass("primary")}>{e.chave}</div>,
            <div key={i} data-valor={utils.getTipoMiddleware(e.item)}
                 className={`${utils.getCorMiddleware(e.item)} badge`}>{utils.getTipoMiddleware(e.item)}</div>,
            <div key={i}>{getConteudo(e.item)}</div>,
        ],
    }));

    function getConteudo(e: Middleware) {
        if (e.redirectscheme) {
            return (
                <div className="d-flex gap-2">
                    <span>{e.redirectscheme.scheme}</span>
                    <Switch titulo="permanent" valor={e.redirectscheme.permanent} disabled/>
                </div>
            );
        }
        if (e.basicAuth) {
            return (
                <div className="d-flex gap-2">
                    <span>{e.basicAuth.users.join(", ")}</span>
                </div>
            );
        }
        if (e.compress) {
            return (
                <div className="d-flex gap-2">
                    <span>compress: {JSON.stringify(e.compress)}</span>
                </div>
            );
        }
        if (e.stripPrefix) {
            return (
                <div className="d-flex gap-2">
                    <span>prefixes: {e.stripPrefix.prefixes.join(", ")}</span>
                </div>
            );
        }
    }

    function getItemSelecionado() {
        return items.find((e, i) => i + 1 === id);
    }

    return (
        <Tela>
            {novo && <MiddlewareNovo onHide={() => setNovo(false)}/>}
            {edicao && <MiddlewareEdicao item={getItemSelecionado().item} chave={getItemSelecionado().chave}
                                         onHide={() => setEdicao(false)}/>}
            <Content>
                <Btx onClick={setNovo}>adicionar</Btx>
                <Btx onClick={setEdicao} disabled={!id}>editar</Btx>
            </Content>
            <Content overflow>
                <Tabela colunas={colunas} linhas={linhas} onClick={setId}/>
            </Content>
        </Tela>
    );
}
