import {expect} from "chai";
import {Traefik} from "./traefik";
import {stringify} from "yaml";
import {utils} from "../services/utils";

describe("traefik", function () {
    describe("teste basico", function () {
        it("deve codificar o arquivo", function () {
            const traefik = new Traefik();
            traefik.novo(); // objeto
            const inp = traefik.config; // objeto
            const encode = traefik.encode(); // string
            traefik.decode(encode); // objeto
            const decode = traefik.config; // objeto
            expect(inp).to.be.deep.equal(decode);
        });

        it("deve gerar o mesmo conteudo que entrou quando nao alterado", function () {
            const traefik = new Traefik();
            traefik.novo();
            const inp = stringify(traefik.config);
            traefik.decode(inp);
            const out = traefik.encode();
            expect(out).to.be.equal(inp);
        });
    });

    describe("controle de rotas", function () {
        it("deve adicionar rota", function () {
            const traefik = new Traefik();
            traefik.novo();
            traefik.addRoute("foo", "Host('foo.com')", "bar", []);
            const ref: typeof traefik.config.http = {
                routers: {
                    foo: {
                        rule: "Host('foo.com')",
                        service: "bar",
                        middlewares: [],
                    },
                },
                middlewares: {},
                services: {},
            };
            expect(traefik.config.http).to.be.deep.equal(ref);
        });
    });

    describe("controle services", function () {
        it("deve adicionar service", function () {
            const traefik = new Traefik();
            traefik.novo();
            traefik.addService("foo", ["https://foo.com"]);
            const ref: typeof traefik.config.http = {
                services: {
                    foo: {
                        loadBalancer: {
                            servers: [{
                                url: "https://foo.com",
                            }],
                        },
                    },
                },
                middlewares: {},
                routers: {},

            };
            expect(traefik.config.http).to.be.deep.equal(ref);
        });
    });
    describe("ordenação chaves middlewares", function () {
        it("deve retornar o objeto ordenado", function () {


            const traefik = new Traefik();
            traefik.novo();

            // sem ordem
            const middlewares: typeof traefik.config.http.middlewares = {
                tohttps: {
                    redirectscheme: {
                        scheme: "https",
                        permanent: false,
                    },
                },
                tohttp: {
                    redirectscheme: {
                        scheme: "http",
                        permanent: false,
                    },
                },
            };

            // ordenado
            const ref: typeof traefik.config.http.middlewares = {
                tohttp: {
                    redirectscheme: {
                        scheme: "http",
                        permanent: false,
                    },
                },
                tohttps: {
                    redirectscheme: {
                        scheme: "https",
                        permanent: false,
                    },
                },
            };
            expect(utils.ordenar(middlewares)).to.be.deep.equal(ref);
        });
    });
});

export {};
