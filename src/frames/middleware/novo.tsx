import {useAvisos} from "context/avisos";
import {useEffect, useState} from "react";
import {Middleware} from "lib/types";
import {Acao, Content, Input, Modal, MR, SelectOne, SO} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";
import {MiddlewareTipo} from "frames/middleware/tipo";

interface Props {
    onHide: (mr: MR) => void;
}

type MiddlewareType = "redirectscheme" | "compress" | "basicAuth" | "stripPrefix";

export function MiddlewareNovo(p: Props) {
    const {depois, setDepois} = useConfig();
    const [item, setItem] = useState<Middleware>({} as Middleware);
    const [chave, setChave] = useState("");
    const [tipo, setTipo] = useState<MiddlewareType>("redirectscheme");
    const avisos = useAvisos();
    const middlewaresAtuais = depois.http.middlewares;

    useEffect(() => {
        const middleware: Middleware = {};

        switch (tipo) {
            case "redirectscheme":
                middleware.redirectscheme = {scheme: "", permanent: false};
                break;
            case "compress":
                middleware.compress = {};
                break;
            case "basicAuth":
                middleware.basicAuth = {users: [""]};
                break;
            case "stripPrefix":
                middleware.stripPrefix = {prefixes: [""]};
                break;
            default:
                break;
        }

        setItem(middleware);

    }, [tipo]);

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(middlewaresAtuais, chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outro middleware");

                if (!chave)
                    return avisos.erro("Nome da chave é obrigatório");

                adicionarMiddleware();
                avisos.sucesso("criar");
            }

            p.onHide(mr);

        } catch (e) {
            avisos.erro(e.message);
        }
    }

    function adicionarMiddleware() {
        const novosMiddlewares = {...middlewaresAtuais, [chave]: item};
        const novoHttp = {...depois.http, middlewares: utils.ordenar(novosMiddlewares)};
        setDepois({http: novoHttp});
    }

    const optionsTipos: SO[] = [
        {valor: "redirectscheme", titulo: "redirectscheme"},
        {valor: "compress", titulo: "compress"},
        {valor: "basicAuth", titulo: "basicAuth"},
        {valor: "stripPrefix", titulo: "stripPrefix"},
    ];

    return <Modal size="lg" titulo="Novo middleware" onHide={onHide} mr={[MR.cancelar, MR.salvar]}>
        <Content flex>
            <Acao titulo="Nome">
                <Input valor={chave} onChange={v => setChave(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <Acao titulo="Tipo">
                <SelectOne options={optionsTipos} valor={tipo} onChange={v => setTipo(v)}/>
            </Acao>
        </Content>
        <Content flex>
            <MiddlewareTipo item={item} setItem={setItem}/>
        </Content>
    </Modal>;
}

