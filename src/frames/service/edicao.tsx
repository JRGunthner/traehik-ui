import {useAvisos} from "context/avisos";
import {useState} from "react";
import {Service} from "lib/types";
import {Acao, Content, Input, Modal, MR, TextArea} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";

interface Props {
    item: Service;
    chave: string;
    onHide: (mr: MR) => void;
}

export function ServiceEdicao(p: Props) {
    const avisos = useAvisos();
    const {depois, setDepois} = useConfig();
    const [item, setItem] = useState(p.item);
    const [chave, setChave] = useState(p.chave);
    const servicesAtuais = depois.http.services;

    function salvar() {
        const novoServices = {...servicesAtuais};
        delete novoServices[p.chave];
        novoServices[chave] = item;
        setDepois({http: {...depois.http, services: utils.ordenar(novoServices)}});

        avisos.sucesso("salvar");
    }

    function excluir() {
        const novoHttp = {...depois.http, services: {...servicesAtuais}};
        delete novoHttp.services[chave];
        setDepois({http: novoHttp});

        avisos.sucesso("excluir");
    }

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(servicesAtuais, chave, p.chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outro service");

                if (!chave)
                    return avisos.erro("Nome da chave é obrigatório");

                // Se mudar o nome do service, replicar o novo nome em todas as rotas que o utilizam
                if (chave !== p.chave)
                    Object.values(depois.http.routers).forEach((router) => {
                        if (router.service === p.chave)
                            router.service = chave;
                    });

                salvar();
            }

            if (mr === MR.excluir) {
                if (!await avisos.confirmar())
                    return;

                excluir();
            }

            p.onHide(mr);
        } catch (e) {
            avisos.erro(e.message);
        }
    }

    function converterParaServers(urls: string[]): typeof item.loadBalancer.servers {
        return urls.map(url => ({url}));
    }

    return <Modal size="lg" titulo="Edição" onHide={onHide} mr={[MR.cancelar, MR.salvar, MR.excluir]}>
        <Content flex>
            <Acao titulo="Nome" desc="Nome deve ser único">
                <Input valor={chave} onChange={v => setChave(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="URLs">
                <TextArea valor={item.loadBalancer.servers.map(server => server.url).join("\n")
                } onChange={v => setItem({
                    ...item,
                    loadBalancer: {
                        ...item.loadBalancer,
                        servers: converterParaServers(v.split("\n").map(e => e.trim())),
                    },
                })}/>
            </Acao>
        </Content>
    </Modal>;
}

