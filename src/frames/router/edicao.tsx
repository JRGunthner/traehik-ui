import {useAvisos} from "context/avisos";
import {useState} from "react";
import {Router} from "lib/types";
import {Acao, Content, Input, Modal, MR, SelectMany, SO, Switch} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";
import {SelectService} from "frames/select/service";

interface Props {
    item: Router;
    chave: string;
    onHide: (mr: MR) => void;
}

type EntryPointsType = "web" | "websecure";

const optionsEntryPoints: SO[] = [
    {valor: "web", titulo: "web"},
    {valor: "websecure", titulo: "websecure"},
];

export function RouterEdicao(p: Props) {
    const avisos = useAvisos();
    const {depois, setDepois} = useConfig();
    const [item, setItem] = useState(p.item);
    const [certResolver, setCertResolver] = useState(isCertResolver());
    const [middlewares, setMiddlewares] = useState<string[]>(item.middlewares || []);
    const [entryPoints, setEntryPoints] = useState<string[]>(item.entryPoints || []);
    const [chave, setChave] = useState(p.chave);
    const routersAtuais = depois.http.routers;

    function isCertResolver() {
        return item.tls?.certResolver === "letsencrypt";
    }

    function salvar() {
        const novoRouters = {...routersAtuais};
        delete novoRouters[p.chave];
        novoRouters[chave] = item;
        setDepois({http: {...depois.http, routers: utils.ordenar(novoRouters)}});

        avisos.sucesso("salvar");
    }

    function excluir() {
        const novoHttp = {...depois.http, routers: {...routersAtuais}};
        delete novoHttp.routers[chave];
        setDepois({http: novoHttp});

        avisos.sucesso("excluir");
    }

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(routersAtuais, chave, p.chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outro router");

                if (!chave)
                    return avisos.erro("Nome da chave é obrigatório");

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

    function onChangeCertResolver(valor: boolean) {
        setCertResolver(valor);
        if (valor)
            setItem({...item, tls: {certResolver: "letsencrypt"}});
        else {
            const {tls, ...itemSemTls} = item;
            setItem(itemSemTls);
        }
    }

    function onChangeEntryPoints(valores: EntryPointsType[]) {
        setEntryPoints(valores);
        if (valores.length > 0)
            setItem({...item, entryPoints: valores});
        else {
            const {entryPoints, ...itemSemEntryPoints} = item;
            setItem(itemSemEntryPoints);
        }
    }

    function onChangeMiddlewares(valores: string[]) {
        setMiddlewares(valores);
        if (valores.length > 0)
            setItem({...item, middlewares: valores});
        else {
            const {middlewares, ...itemSemMiddlewares} = item;
            setItem(itemSemMiddlewares);
        }
    }

    function optionsMiddlewares(): SO<string>[] {
        const chavesMiddlewares = Object.keys(depois.http.middlewares);
        return chavesMiddlewares.map(e => {
            return {valor: e, titulo: e};
        });
    }

    return <Modal size="lg" titulo="Edição" onHide={onHide} mr={[MR.cancelar, MR.salvar, MR.excluir]}>
        <Content flex>
            <Acao titulo="Nome" desc="Nome deve ser único">
                <Input valor={chave} onChange={v => setChave(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Rule" desc="Ex: Host(`service.local`)">
                <Input valor={item.rule} onChange={v => setItem({...item, rule: v})}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Service" flex={6}>
                <SelectService valor={item.service} onChange={v => setItem({...item, service: v})}/>
            </Acao>
            <Acao titulo="entryPoints" flex={6}>
                <SelectMany
                    options={optionsEntryPoints}
                    valores={entryPoints}
                    onChange={v => onChangeEntryPoints(v)}
                />
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="certResolver">
                <Switch titulo="letsencrypt" valor={certResolver} onChange={v => onChangeCertResolver(v)}/>
            </Acao>
        </Content>
        <Content flex>

            <Acao titulo="middlewares">
                <SelectMany options={optionsMiddlewares()} valores={middlewares}
                            onChange={v => onChangeMiddlewares(v)}/>
            </Acao>
        </Content>
    </Modal>;
}
