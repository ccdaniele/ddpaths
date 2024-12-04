const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */


let decorationType;

function activate(context) {

    decorationType = vscode.window.createTextEditorDecorationType({
        textDecoration: 'underline',
        color: 'blue',
        cursor: 'pointer'
    });

    // Register event listeners
    // let openListener = vscode.workspace.onDidOpenTextDocument((document) => {
    //     if (document.fileName.endsWith('g')) {
    //         decorateEditor();
    //     }
    // });

    // let changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    //     const editor = vscode.window.activeTextEditor;
    //     if (editor && editor.document.fileName.endsWith('g')) {
    //         decorateEditor();
    //     }
    // });

    console.log('Extension activated!');

    // Check currently open documents
    vscode.workspace.textDocuments.forEach((document) => {
        console.log('Already open:', document.fileName);
		if (document.fileName.endsWith('g')) {
            console.log('true')
			decorateEditor();
        }
    });

    // Register the command
    const disposable = vscode.commands.registerCommand('ddpaths.helloWorld', function () {
        console.log('Starting disposable');
        vscode.window.showInformationMessage('Hello World from ddpaths!');
    });

    context.subscriptions.push(disposable);
}


function decorateEditor() {

	console.log ('runnning decorate editor')
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const text = editor.document.getText();
    const decorations = [];
    const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC/;

    text.split('\n').forEach((line, lineIndex) => {
        const match = line.match(/\(.*?\)/);
        if (timestampRegex.test(line) && match) {
            const clickableSection = match[0].split(' ')[0].slice(1); // Extract content
            const start = line.indexOf(match[0]);
            const range = new vscode.Range(
                new vscode.Position(lineIndex, start),
                new vscode.Position(lineIndex, start + match[0].length)
            );
            decorations.push({
                range,
                hoverMessage: `Click to view ${clickableSection}`,
            });
        }
    });

    // Apply decorations
    editor.setDecorations(decorationType, decorations);
}


// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
