import type {Config} from "./types";
import {parse, stringify} from "yaml";

export class Traefik {
    config: Config;

    /*  constructor(private config: Config) {
      }*/

    novo() {
        this.config = {
            http: {
                middlewares: {},
                routers: {},
                services: {},
            },
        };
    }

    decode(content: string) {
        this.config = parse(content);
    }

    addRoute(name: string, rule: string, service: string, middlewares?: string[]) {
        this.config.http.routers[name] = {
            rule: rule,
            service: service,
            middlewares: middlewares,
        };
    }

    addService(name: string, urls: string[]) {
        this.config.http.services[name] = {
            loadBalancer: {
                servers: urls.map(url => ({url})),
            },
        };
    }

    encode(): string {
        return stringify(this.config);
    }
}
