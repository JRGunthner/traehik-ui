import {Middleware} from "lib/types";

type ObjectWithKeys = { [key: string]: any };

class Utils {
    ordenar(obj: ObjectWithKeys): ObjectWithKeys {
        const objOrdenados: ObjectWithKeys = {};
        Object.keys(obj).sort().forEach(key => {
            objOrdenados[key] = obj[key];
        });
        return objOrdenados;
    }

    isChaveExistente(obj: ObjectWithKeys, novaChave: string, chaveAtual?: string): boolean {
        const chaves = Object.keys(obj).filter(key => key !== chaveAtual);
        return chaves.includes(novaChave);
    }

    getTipoMiddleware(item: Middleware): string {
        if (item.redirectscheme)
            return "redirectScheme";
        if (item.compress)
            return "compress";
        if (item.basicAuth)
            return "basicAuth";
        if (item.stripPrefix)
            return "stripPrefix";
        return "";
    }

    getLinkDocsMiddleware(item: Middleware): string {
        if (item.redirectscheme)
            return "https://doc.traefik.io/traefik/middlewares/http/redirectscheme/";
        if (item.compress)
            return "https://doc.traefik.io/traefik/middlewares/http/compress/";
        if (item.basicAuth)
            return "https://doc.traefik.io/traefik/middlewares/http/basicauth/";
        if (item.stripPrefix)
            return "https://doc.traefik.io/traefik/middlewares/http/stripprefix/";
        return "";
    }

    getCorMiddleware(item: Middleware): string {
        const clazz = "bg-opacity-25 text-dark text-opacity-75";
        if (item.redirectscheme)
            return "bg-success " + clazz;
        if (item.compress)
            return "bg-secondary " + clazz;
        if (item.basicAuth)
            return "bg-danger " + clazz;
        if (item.stripPrefix)
            return "bg-warning " + clazz;
        return "";
    }

    getBadgeClass(cor: string) {
        const clazz = "badge bg-opacity-25 text-dark text-opacity-75";
        const badgeClass = {
            primary: "bg-primary " + clazz,
            success: "bg-success " + clazz,
            warning: "bg-warning " + clazz,
            danger: "bg-danger " + clazz,
            info: "bg-info " + clazz,
        };
        return badgeClass[cor] || "";
    }
}

export const utils = new Utils();
