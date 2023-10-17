import {useAvisos} from "context/avisos";
import {useState} from "react";
import {Middleware} from "lib/types";
import {Acao, Content, Icone, Input, Modal, MR, Tooltip} from "comps";
import {useConfig} from "context/config";
import {utils} from "services/utils";
import {MiddlewareTipo} from "frames/middleware/tipo";
import Link from "next/link";

interface Props {
    item: Middleware;
    chave: string;
    onHide: (mr: MR) => void;
}

export function MiddlewareEdicao(p: Props) {
    const avisos = useAvisos();
    const {depois, setDepois} = useConfig();
    const [item, setItem] = useState(p.item);
    const [novaChave, setNovaChave] = useState(p.chave);
    const middlewaresAtuais = depois.http.middlewares;

    function salvar() {
        const novoMiddlewares = {...middlewaresAtuais};
        delete novoMiddlewares[p.chave];
        novoMiddlewares[novaChave] = item;
        setDepois({http: {...depois.http, middlewares: utils.ordenar(novoMiddlewares)}});

        avisos.sucesso("salvar");
    }

    function excluir() {
        const novoHttp = {...depois.http, middlewares: {...middlewaresAtuais}};
        delete novoHttp.middlewares[novaChave];
        setDepois({http: novoHttp});

        avisos.sucesso("excluir");
    }

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {

                if (utils.isChaveExistente(middlewaresAtuais, novaChave, p.chave))
                    return avisos.erro("Nome da chave não pode ser igual ao de outro middleware");

                if (!novaChave)
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

    return <Modal size="lg" titulo="Edição" onHide={onHide} mr={[MR.cancelar, MR.salvar, MR.excluir]}>
        <Content flex>
            <div className={`p-2 rounded d-flex justify-content-between ${utils.getCorMiddleware(item)}`}>
                <span>
                {utils.getTipoMiddleware(item)}
                </span>
                <Tooltip titulo={`Abrir link da documentação`}>
                    <Link target={"_blank"} href={utils.getLinkDocsMiddleware(item)}>
                        <Icone tamanho={Icone.Tamanho.md} nome={"fa-circle-info"} cor={Icone.Cor.secondary}/>
                    </Link>
                </Tooltip>
            </div>
        </Content>
        <Content flex>
            <Acao titulo="Nome" desc="Nome deve ser único">
                <Input valor={novaChave} onChange={v => setNovaChave(v)}/>
            </Acao>
        </Content>
        <MiddlewareTipo item={item} setItem={setItem}/>
    </Modal>;
}

