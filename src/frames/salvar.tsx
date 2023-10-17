import {useAvisos} from "context/avisos";
import {Modal, MR, ViewDiff} from "comps";
import {useConfig} from "context/config";
import {stringify} from "yaml";

interface Props {
    onHide: (mr: MR) => void;
}

export function FrameSalvar(p: Props) {
    const {antes, depois, salvar} = useConfig();
    const avisos = useAvisos();

    async function onHide(mr: MR) {
        try {
            if (mr === MR.salvar) {
                salvar();
                avisos.sucesso("salvar");
            }

            p.onHide(mr);

        } catch (e) {
            avisos.erro(e.message);
        }
    }

    return <Modal fullscreen size={"xl"} titulo="Salvar configuração" onHide={onHide} mr={[MR.cancelar, MR.salvar]}>
        <ViewDiff antes={stringify(antes)} depois={stringify(depois)}/>
    </Modal>;
}
