import {Card, Content, Icone, Tela} from "comps";
import {useConfig} from "context/config";
import Link from "next/link";

export default function Home() {
    const {depois} = useConfig();

    if (!depois?.http)
        return;

    function getCor(titulo: string) {
        const cor = {
            Middlewares: Icone.Cor.warning,
            Routes: Icone.Cor.primary,
            Services: Icone.Cor.secondary,
        };
        return cor[titulo];
    }

    function getQtdItens(titulo: string) {
        const qtd = {
            Middlewares: Object.keys(depois.http.middlewares).length,
            Routes: Object.keys(depois.http.routers).length,
            Services: Object.keys(depois.http.services).length,
        };
        return qtd[titulo];
    }

    function getLink(titulo: string) {
        const link = {
            Middlewares: "/middlewares",
            Routes: "/routers",
            Services: "/services",
        };
        return link[titulo];
    }

    function rdCard(titulo: string, icone: string) {
        return <Link className={"text-black text-decoration-none"} href={getLink(titulo)}>
            <Card titulo={titulo}>
                <div className={"d-flex my-3 align-items-center justify-content-between"}>
                    <Icone nome={icone} tamanho={Icone.Tamanho.xl} cor={getCor(titulo)}/>
                    <span className={"display-1"}>{getQtdItens(titulo)}</span>
                </div>
            </Card>
        </Link>;
    }

    return <Tela>
        <Content>
            <h1 className={"text-center w-100"}>Bem vindo</h1>
        </Content>
        <Content>
            <div className={"d-flex flex-wrap gap-2 w-100 justify-content-center"}>
                {rdCard("Middlewares", "fa-layer-group")}
                {rdCard("Routes", "fa-globe")}
                {rdCard("Services", "fa-bolt")}
            </div>
        </Content>
    </Tela>;

}
