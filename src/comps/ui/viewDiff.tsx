import ReactDiffViewer, {ReactDiffViewerProps, ReactDiffViewerStylesOverride} from "react-diff-viewer";
import {tomorrow} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

interface Props extends Partial<ReactDiffViewerProps> {
    antes: string;
    depois: string;
}

const customStyles: ReactDiffViewerStylesOverride = {
    line: {
        fontSize: "1.2rem",
        "& pre": {
            lineHeight: "0.8rem",
            overflowY: "hidden",
        },
    },
    lineNumber: {
        fontSize: "1rem",
    },
};

export function ViewDiff(p: Props) {
    return (
        <ReactDiffViewer
            disableWordDiff
            styles={customStyles}
            leftTitle="Original" rightTitle="Modificado"
            oldValue={p.antes}
            newValue={p.depois}{...p}
            renderContent={(source) => (
                <SyntaxHighlighter language="yaml" style={tomorrow}>
                    {source}
                </SyntaxHighlighter>
            )}
        />
    );
}
