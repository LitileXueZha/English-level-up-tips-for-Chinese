const fs = require('fs/promises');
const { marked } = require('marked');
const path = require('path');

const DIRs = [
    'part-1',
    'part-2',
];

class Analytics {
    constructor() {
        this.tokens = [];
    }

    async run() {
        const files = await this.readFiles(DIRs);
        
        for (const file of files) {
            await this.analyze(file);
        }
    }

    async readFiles(dirs) {
        const files = [];

        for (const dir of dirs) {
            const dirPath = path.resolve(__dirname, '..', dir);
            const dirFiles = await fs.readdir(dirPath);
            
            for (const file of dirFiles) {
                files.push(path.join(dir, file));
            }
        }
        return files;
    }

    async analyze(file) {
        const filePath = path.resolve(__dirname, '..', file);
        const content = await fs.readFile(filePath, 'utf-8');

        marked.parse(content, { walkTokens: this.walkTokens });
        debugger;
    }

    walkTokens = (token) => {
        if (token.type === 'image') {
            console.log(token);
        }
    }
}

new Analytics().run();
