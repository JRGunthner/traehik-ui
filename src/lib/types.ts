export interface Config {
    http: Http;
}

interface Http {
    middlewares: { [key: string]: Middleware };
    routers: { [key: string]: Router };
    services: { [key: string]: Service };
}

export interface Middleware {
    redirectscheme?: Redirectscheme;
    basicAuth?: BasicAuth;
    compress?: {};
    stripPrefix?: StripPrefix;
}

interface Redirectscheme {
    scheme: string;
    permanent: boolean;
}

interface BasicAuth {
    users: string[];
}

interface StripPrefix {
    prefixes: string[];
}

export interface Router {
    rule: string;
    service: string;
    middlewares?: string[];
    tls?: TLS;
    entryPoints?: string[];
}

interface TLS {
    certResolver: string;
}

export interface Service {
    loadBalancer: LoadBalancer;
}

interface LoadBalancer {
    servers: Server[];
}

interface Server {
    url: string;
}


