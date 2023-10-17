import {createContext, useContext, useEffect, useState} from "react";
import {Config} from "lib/types";
import {api} from "services/api/service";
import * as yaml from "yaml";
import {useAvisos} from "context/avisos";

interface IContextConfig {
    antes: Config;
    depois: Config;
    salvar: () => void;
    reverter: () => void;
    setAntes: (valor: Config) => void;
    setDepois: (valor: Config) => void;
}

const Context = createContext<IContextConfig>(null);

export function useConfig(): IContextConfig {
    return useContext(Context);
}

interface Props {
    children: any;
}

export function ContextConfig(p: Props) {
    const [antes, setAntes] = useState<Config>({} as Config);
    const [depois, setDepois] = useState<Config>({} as Config);
    const avisos = useAvisos();

    useEffect(() => {
        api.load_get().then(res => {
            const config = yaml.parse(res.content);
            setAntes(config);
            setDepois(config);
        });
    }, []);

    async function salvar() {
        await api.save_post(depois);
        setAntes(depois);
    }

    async function reverter() {
        if (!await avisos.confirmar("reverter"))
            return;
        setDepois(antes);
        avisos.sucesso("As alterações foram revertidas!");
    }

    return (
        <Context.Provider
            value={{antes, depois, salvar, reverter, setAntes, setDepois}}>
            {p.children}
        </Context.Provider>
    );
}
