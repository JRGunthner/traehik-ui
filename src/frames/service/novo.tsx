import {useAvisos} from "context/avisos";
import {useState} from "react";
import {Service} from "lib/types";
import {Acao, Content, Input, Modal, MR, TextArea} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";

interface Props {
    onHide: (mr: MR) => void;
}

export function ServiceNovo(p: Props) {
    const {depois, setDepois} = useConfig();
    const [chave, setChave] = useState("");
    const [urls, setUrls] = useState<string[]>([]);
    const avisos = useAvisos();
    const servicesAtuais = depois.http.services;

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(servicesAtuais, chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outra rota");

                if (!chave)
                    return avisos.erro("Nome da chave é obrigatório");

                adicionarService();
                avisos.sucesso("criar");
            }

            p.onHide(mr);

        } catch (e) {
            avisos.erro(e.message);
        }
    }

    function adicionarService() {
        const service: Service = {loadBalancer: {servers: []}};
        service.loadBalancer.servers = urls.flatMap(url => ({url}));

        const novosServices = {...servicesAtuais, [chave]: service};
        const novoHttp = {...depois.http, services: utils.ordenar(novosServices)};
        setDepois({http: novoHttp});
    }

    return <Modal size="lg" titulo="Novo service" onHide={onHide} mr={[MR.cancelar, MR.salvar]}>
        <Content flex>
            <Acao titulo="Nome">
                <Input valor={chave} onChange={v => setChave(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Urls">
                <TextArea valor={urls.join("\n")
                } onChange={v => setUrls(v.split("\n").map(e => e.trim()))}/>
            </Acao>
        </Content>
    </Modal>;
}
