import css from "./menu.module.scss";
import {Container, Form, Nav, Navbar as NavbarRB} from "react-bootstrap";
import {Icone, Tooltip} from "comps";
import {useConfig} from "context/config";
import {stringify} from "yaml";
import {FormEvent, useEffect, useState} from "react";
import {NavItem} from "menu/nav_item";
import {FrameSalvar} from "frames/salvar";
import Link from "next/link";
import Image from "next/image";
import {usePesquisa} from "context/pesquisa";
import {useRouter} from "next/router";

export function Navbar() {
    const [modalSalvar, setModalSalvar] = useState(false);
    const [pesquisa, setValue] = useState("");
    const {antes, depois, reverter} = useConfig();
    const {setPesquisa} = usePesquisa();
    const router = useRouter();

    function isMostraPesquisa() {
        return ["/middlewares", "/routers", "/services"].some(prefix => router.pathname.includes(prefix));
    }

    useEffect(() => {
        setPesquisa(pesquisa);
    }, [pesquisa]);

    useEffect(() => {
        if(isMostraPesquisa())
        document.getElementById("pesquisa").focus();
        setValue("");
    },[router.pathname])

    function isAlterou() {
        return stringify(antes) !== stringify(depois);
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPesquisa(pesquisa);
    }

    return (<NavbarRB className={css.nav}>
            {modalSalvar && <FrameSalvar onHide={() => setModalSalvar(false)}/>}
            <Container fluid>
                <Link className={"text-decoration-none me-3"} href={"/"}>
                    <Image priority style={{objectFit: "contain"}} quality={100} src={"/logo.svg"}
                           alt={"Logo do Trafiek"} width={150} height={56}/>
                </Link>
                <Nav className="w-100 align-items-center">
                    <NavItem href="/middlewares" titulo="Middlewares"/>
                    <NavItem href="/routers" titulo="Routers"/>
                    <NavItem href="/services" titulo="Services"/>
                    <div className="d-flex w-100 gap-3 justify-content-end align-items-center">
                        {isMostraPesquisa() &&
                            <Form onSubmit={onSubmit}>
                                <Form.Control
                                    id="pesquisa"
                                    type="search"
                                    autoFocus
                                    placeholder="Pesquisar..."
                                    value={pesquisa}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </Form>
                        }
                        {isAlterou() && <>
                            <Tooltip titulo="Reverter alterações">
                                <Icone tamanho={Icone.Tamanho.md} cor={Icone.Cor.danger} nome={"fa-clock-rotate-left"}
                                       onClick={reverter}/>
                            </Tooltip>

                            <Tooltip titulo="Há alterações pendentes para serem salvas!">
                                <Icone tamanho={Icone.Tamanho.md} cor={Icone.Cor.warning}
                                       nome={"fa-triangle-exclamation fa-beat-fade"}/>
                            </Tooltip>
                        </>
                        }
                        <div className="d-flex gap-3 align-items-center text-end">
                            <Tooltip titulo="Salvar">
                                <Icone tamanho={Icone.Tamanho.md} cor={Icone.Cor.primary} nome={"fa-save"}
                                       onClick={() => setModalSalvar(true)}/>
                            </Tooltip>
                        </div>
                    </div>
                </Nav>
            </Container>
        </NavbarRB>
    );
}
