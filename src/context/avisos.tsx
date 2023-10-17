import {createContext, useContext, useEffect, useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";
import {Icone} from "comps";
import Swal, {SweetAlertCustomClass, SweetAlertOptions} from "sweetalert2";
import css from "../styles/sweetAlert.module.scss";

type Tipos = "salvar" | "excluir" | "reverter" | string;
type Estilos = "success" | "danger" | "light";

interface AvisosContext {
    sucesso: (texto: Tipos) => void;
    mensagem: (texto: string) => void;
    erro: (texto: Tipos) => void;
    confirmar: (tipo?: Tipos) => Promise<boolean>;
}

const Context = createContext<AvisosContext>(null);

export function useAvisos(): AvisosContext {
    return useContext(Context);
}

interface Props {
    children: any;
}

interface Item {
    titulo: string;
    texto: string;
    estilo: Estilos;
    icone?: string;
    id: number;
}

let id = 0;

const swalPadrao = Swal.mixin({
    cancelButtonText: "Cancelar",
    icon: "question",
    showCancelButton: true,
    buttonsStyling: false,
});

const customClass: SweetAlertCustomClass = {
    actions: "gap-3 w-100",
    icon: "border-0 fs-5",
    cancelButton: `btn btn-secondary ${css.botao}`,
};

export function ContextAvisos(p: Props) {
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        function handleEscapeKeyPress(e) {
            if (e.key === "Escape") {
                if (Swal.isVisible()) {
                    e.preventDefault();
                    Swal.close();
                }
            }
        }

        document.addEventListener("keydown", handleEscapeKeyPress);

        return () => {
            document.removeEventListener("keydown", handleEscapeKeyPress);
        };
    }, []);

    async function confirmar(tipo: Tipos = "excluir"): Promise<boolean> {

        let options: SweetAlertOptions = {
            iconHtml: `<i class="fa fa-triangle-exclamation"></i>`,
            iconColor: "#DC3545",
            customClass: {
                ...customClass,
                confirmButton: `btn btn-danger ${css.botao}`,
            },
        };

        if (tipo === "excluir") {
            options = {
                ...options,
                title: "Tem certeza que deseja excluir?",
                confirmButtonText: "Excluir",
            };
        } else if (tipo === "reverter") {
            options = {
                ...options,
                title: "Tem certeza que deseja reverter as alterações?",
                text: "Essa ação não pode ser desfeita!",
                confirmButtonText: "Reverter",
            };
        }

        const {isConfirmed} = await swalPadrao.fire(options);

        if (isConfirmed && tipo === "excluir")
            sucesso("excluir");

        if (isConfirmed && tipo === "reverter")
            sucesso("As alterações foram revertidas!");

        return isConfirmed;
    }

    function sucesso(texto: string) {
        const renderTexto = (): string => {
            const txt: { [index: Tipos]: string } = {
                salvar: "Alterações salvas!",
                adicionar: "Dados gravados!",
                excluir: "Item excluído!",
            };
            return txt[texto] || texto;
        };

        setItems([...items, {
            titulo: "Sucesso",
            texto: renderTexto(),
            icone: "fa-circle-check",
            estilo: "success",
            id: id++,
        }]);
    }

    function erro(texto: string) {
        setItems([...items, {
            titulo: "Erro",
            texto: texto,
            icone: "fa-circle-exclamation",
            estilo: "danger",
            id: id++,
        }]);
    }

    function mensagem(texto: string) {
        setItems([...items, {
            titulo: "Mensagem",
            texto: texto,
            estilo: "light",
            id: id++,
        }]);
    }

    function fechar(item: Item) {
        setItems(items.filter(e => e !== item));
    }

    return (
        <Context.Provider value={{sucesso, erro, mensagem, confirmar}}>
            {p.children}
            <ToastContainer position={"bottom-end"} className={"p-3"} style={{zIndex: 9999}}>
                {items.map((item) => (
                    <Toast show key={item.id}
                           className={`${item.estilo === "light" ? "text-black" : "text-white"}`}
                           onClose={() => fechar(item)} bg={item.estilo} autohide delay={2500}>
                        <Toast.Header className={"d-flex gap-1"}>
                            <Icone nome={item.icone}
                                   cor={item.estilo === "success" ? Icone.Cor.success : Icone.Cor.danger}/>
                            <strong className="me-auto">{item.titulo}</strong>
                        </Toast.Header>
                        <Toast.Body>{item.texto}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </Context.Provider>
    );
}
