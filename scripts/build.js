const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');

const DIRs = [
    'part-1',
    'part-2',
];
const OUTPUT = path.join(__dirname, '../build.md');
const OUTPUT_HTML = path.join(__dirname, '../index.html');
const TEMP_HTML = path.join(__dirname, 'index.html');

class BuildWork {
    constructor() {}

    async start() {
        const files = await this.readFiles(DIRs);
        let outputContent = '';

        for (const file of files) {
            const filePath = path.resolve(__dirname, '..', file);
            const content = await fs.readFile(filePath, 'utf-8');

            outputContent += content;
        }

        const abstract = await fs.readFile(path.resolve(__dirname, '../abstract.md'), 'utf-8');
        const html = marked.parse(outputContent, { walkTokens: this.walkTokens });
        const abstractHtml = marked.parse(abstract);
        const template = await fs.readFile(TEMP_HTML, 'utf-8');
        
        await fs.writeFile(OUTPUT, abstract + outputContent);
        await fs.writeFile(OUTPUT_HTML, template.replace('<!-- %build% -->', abstractHtml + html));
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

    walkTokens = (token) => {
        if (token.type === 'image') {
            token.href = token.href.replace(/^\.\.\//, '');
            if (token.href.startsWith('http')) {
                // TODO: 下载图片到本地
            }
            if (/(why|cat)/i.test(token.text)) {
                token.title = 'sticker';
            }
        }
        if (token.type === 'heading') {
            token.depth += 1;
        }
        if (token.type === 'paragraph' && token.raw.startsWith('下一篇')) {
            token.text = '';
            token.tokens = [];
        }
    }
}

new BuildWork().start();
