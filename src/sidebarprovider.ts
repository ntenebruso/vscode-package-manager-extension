import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export default class SidebarProvider implements vscode.TreeDataProvider<Dependency> {
    private _view?: vscode.WebviewView;

    constructor(
        private readonly workspaceRoot: string
    ) { }

    getTreeItem(element: Dependency): vscode.TreeItem {
        return element;
    }

    private getDepsInPackageJSON(packageJSONPath: string): Dependency[] {
        if (this.pathExists(packageJSONPath)) {
            const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'));
            const toDep = (moduleName: string): Dependency => {
                return new Dependency(moduleName, packageJSON.dependencies[moduleName], vscode.TreeItemCollapsibleState.None);
            };
    
            const deps = packageJSON.dependencies ? Object.keys(packageJSON.dependencies).map(dep => toDep(dep)) : [];
    
            return deps;
        } else {
            return []
        }
    }

    getChildren() {
        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage("No workspace folder open");
            return Promise.resolve([]);
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInPackageJSON(packageJsonPath));
            } else {
                vscode.window.showInformationMessage('Workspace has no package.json');
                return Promise.resolve([]);
            }
        }
    }

    private pathExists(p: string): boolean {
        console.log(p);
        try {
            fs.accessSync(p);
            return true;
        } catch (err) {
            return false;
        }
    }
}

class Dependency extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState)
        this.description = this.version;
        this.tooltip = this.label;
    }

    contextValue = 'dependency';

    iconPath = {
        light: path.join(__filename, '..', '..', 'media', 'dep-dark.svg'),
        dark: path.join(__filename, '..', '..', 'media', 'dep-dark.svg')
    }
}