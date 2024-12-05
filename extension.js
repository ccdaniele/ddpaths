const vscode = require('vscode');

let decorationType;

function activate(context) {
    decorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline',
        color: 'yellow',
        cursor: 'pointer',
    });

    console.log('Extension activated!');

    // Apply decorations to the current open editor
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        decorateEditor(editor);
    }

    // Listen for changes in the active editor
    const activeEditorChangeListener = vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && editor.document.fileName.endsWith('.log')) {
            decorateEditor(editor);
        }
    });

    // Listen for newly opened documents
    const documentOpenListener = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.fileName.endsWith('.log')) {
            const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
            if (editor) {
                decorateEditor(editor);
            }
        }
    });

    // Register the command
    const disposable = vscode.commands.registerCommand('ddpaths.openlink', function () {
        console.log('Starting disposable');
        vscode.window.showInformationMessage('Hello World from ddpaths!');
    });

    context.subscriptions.push(disposable, activeEditorChangeListener, documentOpenListener);
}

function decorateEditor(editor) {
    if (!editor) return;

    const text = editor.document.getText();
    const decorations = [];
    const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/;

    let lineNumber;

    text.split('\n').forEach((line, lineIndex) => {
        const number = line.match(/\(([^ ]+)/);
        const match2 = String(number).match(/:(\d+)$/);
        if (match2) {
            lineNumber = match2[1];
        }

        const match = line.match(/\(([^:]+)/);
        if (timestampRegex.test(line) && match) {
            const clickableSection = match[0].split(' ')[0].slice(1);
            const start = line.indexOf(match[0]);
            const range = new vscode.Range(
                new vscode.Position(lineIndex, start),
                new vscode.Position(lineIndex, start + match[0].length)
            );

            decorations.push({
                range,
                hoverMessage: `Go to the repo https://github.com/DataDog/datadog-agent/blob/main/${clickableSection}#L${lineNumber}`,
            });
        }
    });

    editor.setDecorations(decorationType, decorations);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
