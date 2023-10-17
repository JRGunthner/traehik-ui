import {Middleware} from "lib/types";
import {Acao, Content, Input, Switch, TextArea} from "comps";
import {SelectScheme} from "frames/select/scheme";
import {useState} from "react";
import {api} from "services/api/service";

interface Props {
    item: Middleware;
    setItem: (item: Middleware) => void;
}

export function MiddlewareTipo(p: Props) {
    const [senha, setSenha] = useState("");
    const [hash, setHash] = useState("");

    async function gerarSenha() {
        api.gerar_senha_post(senha).then(res => {
            setHash(res.content);
        });
    }

    function rdPorTipo() {
        if (p.item.redirectscheme)
            return <>
                <Content flex>
                    <div className={"d-flex gap-3 align-items-center"}>
                        <Acao flex={6} titulo="Scheme">
                            <SelectScheme valor={p.item.redirectscheme.scheme} onChange={v => p.setItem({
                                ...p.item,
                                redirectscheme: {...p.item.redirectscheme, scheme: v},
                            })}/>
                        </Acao>
                        <Acao flex={6}>
                            <Switch titulo="Permanent" valor={p.item.redirectscheme.permanent}
                                    onChange={v => p.setItem({
                                        ...p.item,
                                        redirectscheme: {...p.item.redirectscheme, permanent: v},
                                    })}/>
                        </Acao>
                    </div>
                </Content>
            </>;
        if (p.item.basicAuth)
            return <>
                <Content flex>
                    <Acao titulo="Users">
                        <TextArea valor={p.item.basicAuth.users.join("\n")} onChange={v => p.setItem({
                            ...p.item,
                            basicAuth: {...p.item.basicAuth, users: v.split("\n")},
                        })}/>
                    </Acao>
                </Content>
                <Content flex>
                    <Acao flex={10} titulo="Senha">
                        <Input valor={senha} onChange={setSenha}/>
                    </Acao>
                    <Acao flex={2}>
                        <button className="btn btn-secondary w-100" onClick={gerarSenha}>Gerar</button>
                    </Acao>
                </Content>
                <Content flex>
                    <Acao titulo="Hash bcrypt">
                        <Input valor={hash} disabled></Input>
                    </Acao>
                </Content>
            </>;
        if (p.item.stripPrefix)
            return <Content flex>
                <Acao titulo="Prefixes">
                    <TextArea valor={p.item.stripPrefix.prefixes.join("\n")}
                              onChange={v => p.setItem({
                                  ...p.item,
                                  stripPrefix: {...p.item.stripPrefix, prefixes: v.split("\n")},
                              })}/>
                </Acao>
            </Content>;
    }

    return rdPorTipo();
}
