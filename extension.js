const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    console.log('Extension activated!');

    // Check currently open documents
    vscode.workspace.textDocuments.forEach((document) => {
        console.log('Already open:', document.fileName);
    });

    // Register the command
    const disposable = vscode.commands.registerCommand('ddpaths.helloWorld', function () {
        console.log('Starting disposable');
        vscode.window.showInformationMessage('Hello World from ddpaths!');
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
