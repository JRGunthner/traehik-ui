import {useAvisos} from "context/avisos";
import {useState} from "react";
import {Router} from "lib/types";
import {Acao, Content, Input, Modal, MR, Switch} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";
import {SelectService} from "frames/select/service";
import {SelectMiddlewares} from "frames/select/middlewares";
import {SelectEntryPoints, EntryPointsType} from "frames/select/entryPoints";

interface Props {
    onHide: (mr: MR) => void;
}

export function RouterNovo(p: Props) {
    const {depois, setDepois} = useConfig();
    const [chave, setChave] = useState("");
    const [router, setRouter] = useState<Router>({service: "", rule: ""});
    const [certResolver, setCertResolver] = useState(false);
    const [middlewares, setMiddlewares] = useState<string[]>([]);
    const [entryPoints, setEntryPoints] = useState<string[]>([]);
    const avisos = useAvisos();
    const routersAtuais = depois.http.routers;

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(routersAtuais, chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outro router");

                if (!chave)
                    return avisos.erro("Nome da chave é obrigatório");

                adicionarRouter();
                avisos.sucesso("criar");
            }

            p.onHide(mr);

        } catch (e) {
            avisos.erro(e.message);
        }
    }

    function adicionarRouter() {
        const novosRouters = {...routersAtuais, [chave]: router};
        const novoHttp = {...depois.http, routers: utils.ordenar(novosRouters)};
        setDepois({http: novoHttp});
    }

    function onChangeCertResolver(valor: boolean) {
        setCertResolver(valor);
        if (valor)
            setRouter({...router, tls: {certResolver: "letsencrypt"}});
        else {
            const {tls, ...itemSemTls} = router;
            setRouter(itemSemTls);
        }
    }

    function onChangeMiddlewares(valores: string[]) {
        setMiddlewares(valores);
        if (valores.length > 0)
            setRouter({...router, middlewares: valores});
        else {
            const {middlewares, ...itemSemMiddlewares} = router;
            setRouter(itemSemMiddlewares);
        }
    }

    function onChangeEntryPoints(valores: EntryPointsType[]) {
        setEntryPoints(valores);
        if (valores.length > 0)
            setRouter({...router, entryPoints: valores});
        else {
            const {entryPoints, ...itemSemEntryPoints} = router;
            setRouter(itemSemEntryPoints);
        }
    }

    return <Modal size="lg" titulo="Novo router" onHide={onHide} mr={[MR.cancelar, MR.salvar]}>
        <Content flex>
            <Acao titulo="Nome">
                <Input valor={chave} onChange={v => setChave(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Rule" desc="Ex: Host(`service.local`)">
                <Input valor={router.rule} onChange={v => setRouter({...router, rule: v})}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Service" flex={6}>
                <SelectService valor={router.service} onChange={v => setRouter({...router, service: v})}/>
            </Acao>
            <Acao titulo="entryPoints" flex={6}>
                <SelectEntryPoints valores={entryPoints} onChange={(v: EntryPointsType[]) => onChangeEntryPoints(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="certResolver">
                <Switch titulo="letsencrypt" valor={certResolver} onChange={v => onChangeCertResolver(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="middlewares">
                <SelectMiddlewares valores={middlewares} onChange={v => onChangeMiddlewares(v)}/>
            </Acao>
        </Content>
    </Modal>;
}
