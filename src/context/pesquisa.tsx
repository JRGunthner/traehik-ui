import { createContext, useContext, useState } from "react";

interface PesquisaContext {
    pesquisa: string;
    setPesquisa: (pesquisa: string) => void;
    focarPesquisa: () => void;
}

const Context = createContext<PesquisaContext>(null);

export function usePesquisa(): PesquisaContext {
    return useContext(Context);
}

interface Props {
    children: any;
}

export function ContextPesquisa(p: Props) {
    const [pesquisa, setPesquisa] = useState("");

    function focarPesquisa() {
        document.getElementById("pesquisa").focus()
    }

    return (
        <Context.Provider value={{ pesquisa, setPesquisa, focarPesquisa }}>
            {p.children}
        </Context.Provider>
    );
}
