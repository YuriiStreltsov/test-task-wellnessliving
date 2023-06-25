const noAttr = () => {
    return {
        name: 'no-attribute',
        transformIndexHtml(html) {
            return html.replace(`crossorigin`, '');
        },
    };
};

module.exports = {
    root: 'src',
    build: {
        outDir: '../dist',
    },
    base: '/test-task-wellnessliving/',
    plugins: [noAttr()],
};
