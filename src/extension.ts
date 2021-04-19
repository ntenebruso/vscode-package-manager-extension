import * as vscode from 'vscode';
import SidebarProvider from './sidebarprovider';
import * as path from 'path';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    const provider = new SidebarProvider(vscode.workspace.workspaceFolders![0].uri.fsPath);

    context.subscriptions.push(
        vscode.window.registerTreeDataProvider('vsExtensionSidebar', provider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('packageFinder.searchPage', () => {
            const panel = vscode.window.createWebviewPanel('searchPage', 'Search for a package', vscode.ViewColumn.One);
            panel.webview.html = getWebviewHTML(context.extensionUri, panel.webview);
            panel.webview.options = {
                enableScripts: true
            }
            panel.webview.onDidReceiveMessage(message => {
                executeTerminalCommand(message.command);
            });
        })
    );
}

function getWebviewHTML(extensionUri: vscode.Uri, webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "out", "compiled", "bundle.js"));
    return `
        <!DOCTYPE html>
        <html>
            <body>
                <script src="${scriptUri}"></script>
            </body>
        </html>
    `
}

function executeTerminalCommand(command: string) {
    const terminal = vscode.window.createTerminal();
    terminal.show();
    terminal.sendText(command);
}


// this method is called when your extension is deactivated
export function deactivate() { }
