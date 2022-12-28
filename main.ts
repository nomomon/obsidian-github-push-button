import { Notice, Plugin } from 'obsidian';
import * as child_process from 'child_process';

interface ObsidianGithubSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianGithubSettings = {
    mySetting: 'default'
}

export default class ObsidianGithub extends Plugin {
    settings: ObsidianGithubSettings;

    async onload() {
        await this.loadSettings();

        this.addRibbonIcon('github', 'Push to Github', async () => {
            //@ts-ignore
            const path = this.app.vault.adapter.basePath;

            try {
                child_process.exec(
                    "git add . && git commit -m 'auto commit' && git push",
                    { cwd: path },
                    (err, stdout, stderr) => {
                        if (err) {
                            new Notice("Error: " + err.message + "\n" + stdout);
                            return;
                        }
                        if (stdout) {
                            new Notice("Success: " + stdout);
                            return;
                        }
                    }
                )
            }
            catch (e) {
                new Notice(e);
            }
        });
    }

    onunload() {

    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}