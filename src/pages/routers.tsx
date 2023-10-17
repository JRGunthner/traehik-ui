import {useConfig} from "context/config";
import {BtnIcone, Btx, Content, Tabela} from "comps";
import {RouterEdicao, RouterNovo} from "frames";
import {useState} from "react";
import {usePesquisa} from "context/pesquisa";
import {Tela} from "comps/ui/tela/tela";
import {utils} from "services/utils";

export default function TelaRouters() {
    const [novo, setNovo] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [id, setId] = useState(0);
    const {pesquisa} = usePesquisa();
    const {depois} = useConfig();

    if (!depois?.http)
        return;

    function filtrar() {
        const items = Object.entries(depois.http.routers).map(([chave, item]) => {
            return {chave, item};
        });
        return items.filter(m => JSON.stringify(m).toLocaleLowerCase().includes(pesquisa.toLocaleLowerCase()));
    }

    const items = filtrar();

    const colunas: Tabela.Coluna[] = [
        {titulo: "Nome"},
        {titulo: "Rule"},
        {titulo: "Middlewares"},
        {titulo: "Service"},
        {titulo: "EntryPoints"},
        {titulo: "TLS", tipo: "icone"},
    ];

    const linhas: Tabela.Linha[] = items.map((e, i) => ({
        key: i + 1,
        doubleClick: () => {
            setId(i + 1);
            setEdicao(true);
        },
        valores: [
            <div key={i} data-valor={e.chave} className={utils.getBadgeClass("primary")}>{e.chave}</div>,
            <div key={i} data-valor={e.item.rule} className={utils.getBadgeClass("info")}>{e.item.rule}</div>,
            <div key={i} data-valor={e.item.middlewares?.join(" ") ?? ""}>
                {e.item.middlewares?.map((e, j) => <div key={j}
                                                        className={utils.getBadgeClass("success") + " me-1"}>{e}</div>)}</div>,
            <div key={i} data-valor={e.item.service} className={utils.getBadgeClass("warning")}>{e.item.service}</div>,
            <div key={i} data-valor={e.item.entryPoints?.join(" ") ?? ""}>
                {e.item.entryPoints?.map((e, j) => <div key={j}
                                                        className={utils.getBadgeClass("danger") + " me-1"}>{e}</div>)}</div>,
            e.item.tls ? "tls" : " ",
        ],
    }));

    function getItemSelecionado() {
        return items.find((e, i) => i + 1 === id);
    }

    return (
        <Tela>
            {novo && <RouterNovo onHide={() => setNovo(false)}/>}
            {edicao && <RouterEdicao item={getItemSelecionado().item} chave={getItemSelecionado().chave}
                                     onHide={() => setEdicao(false)}/>}
            <Content>
                <Btx onClick={setNovo}>adicionar</Btx>
                <Btx onClick={setEdicao} disabled={!id}>editar</Btx>
                <BtnIcone link="https://doc.traefik.io/traefik/routing/routers/" nome={"fa-circle-info"}>Abrir link da
                    documentação</BtnIcone>
            </Content>
            <Content overflow>
                <Tabela colunas={colunas} linhas={linhas} onClick={setId}/>
            </Content>
        </Tela>
    );
}
