import {API} from "services/api/types";
import {Config} from "lib/types";

interface Api {
    gerar_senha_post(senha: string): Promise<API.YML>;
    load_get(): Promise<API.YML>;
    save_post(config: Config): Promise<void>;
}

class ApiImp implements Api {
    async gerar_senha_post(senha: string): Promise<API.YML> {
        const res = await fetch("/api/gerarSenha", {
            method: "POST",
            body: JSON.stringify(senha),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return res.json();
    }

    async load_get(): Promise<API.YML> {
        const res = await fetch("/api/load");
        return res.json();
    }

    async save_post(config: Config): Promise<void> {
        await fetch("/api/save", {
            method: "POST",
            body: JSON.stringify(config),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export const api: Api = new ApiImp();
