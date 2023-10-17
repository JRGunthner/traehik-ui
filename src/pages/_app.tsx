import "../styles/globals.scss";
import "bootstrap/dist/css/bootstrap.css";
import type {AppProps} from "next/app";
import Head from "next/head";
import {Navbar} from "menu/nav";
import {ContextConfig} from "context/config";
import {ContextAvisos} from "context/avisos";
import {ContextPesquisa} from "context/pesquisa";

export default function App({Component, pageProps}: AppProps) {
    return (
        <>
            <Head>
                <title>Trafiek Config</title>
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <ContextAvisos>
                <ContextConfig>
                <ContextPesquisa>
                    <Navbar/>
                    <div id="app-body">
                        <Component {...pageProps} />
                    </div>
                    </ContextPesquisa>
                </ContextConfig>
            </ContextAvisos>
        </>
    );
}
