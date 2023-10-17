import {useConfig} from "context/config";
import {BtnIcone, Btx, Content, Tabela} from "comps";
import {ServiceEdicao, ServiceNovo} from "frames/";
import {useState} from "react";
import {usePesquisa} from "context/pesquisa";
import {Tela} from "comps/ui/tela/tela";
import {utils} from "services/utils";

export default function TelaServices() {
    const [novo, setNovo] = useState(false);
    const [edicao, setEdicao] = useState(false);
    const [id, setId] = useState(0);
    const {pesquisa} = usePesquisa();
    const {depois} = useConfig();

    if (!depois?.http)
        return;

    function filtrar() {
        const servicesArray = Object.entries(depois.http.services).map(([chave, item]) => {
            return {chave, item};
        });
        return servicesArray.filter(m => JSON.stringify(m).toLocaleLowerCase().includes(pesquisa.toLocaleLowerCase()));
    }

    const items = filtrar();

    const colunas: Tabela.Coluna[] = [
        {titulo: "Nome"},
        {titulo: "URLs"},
        {titulo: "Uso em rotas", tipo: "int"},
    ];

    function getQtdRotasPorService(chave: string) {
        let qtd = 0;
        Object.values(depois.http.routers).forEach((router) => {
            if (router.service === chave)
                qtd++;
        });
        return qtd;
    }

    const linhas: Tabela.Linha[] = items.map((e, i) => ({
        key: i + 1,
        doubleClick: () => {
            setId(i + 1);
            setEdicao(true);
        },
        valores: [
            <div key={i} data-valor={e.chave} className={utils.getBadgeClass("primary")}>{e.chave}</div>,
            <div key={i} data-valor={e.item.loadBalancer.servers?.map(e => e.url).join(" ") ?? ""}>
                {e.item.loadBalancer.servers?.map((e, j) => <div key={j}
                                                                 className={utils.getBadgeClass("success") + " me-1"}>{e.url}</div>)}</div>,
            <div key={i} data-valor={getQtdRotasPorService(e.chave)}
                 className={utils.getBadgeClass("warning") + " fs-6"}>{getQtdRotasPorService(e.chave)}</div>,
        ],
    }));

    function getItemSelecionado() {
        return items.find((e, i) => i + 1 === id);
    }

    return (
        <Tela>
            {novo && <ServiceNovo onHide={() => setNovo(false)}/>}
            {edicao && <ServiceEdicao item={getItemSelecionado().item} chave={getItemSelecionado().chave}
                                      onHide={() => setEdicao(false)}/>}
            <Content>
                <Btx onClick={setNovo}>adicionar</Btx>
                <Btx onClick={setEdicao} disabled={!id}>editar</Btx>
                <BtnIcone link="https://doc.traefik.io/traefik/routing/services/" nome={"fa-circle-info"}>Abrir link da
                    documentação</BtnIcone>
            </Content>
            <Content overflow>
                <Tabela colunas={colunas} linhas={linhas} onClick={setId}/>
            </Content>
        </Tela>
    );
}
