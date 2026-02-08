module.exports = {
    title: 'Базальта',
    description:
        'Платформа для создания единого информационного пространства предприятия',
    themeConfig: {
        head: [['link', { rel: 'icon', href: '/logo.png' }]],
        nav: [
            { text: 'Главная', link: '/' },
            { text: 'Видео', link: '/video/' },
            { text: 'Контакты', link: '/contacts/' },
        ],
        sidebar: 'auto',
    },
    plugins: [
        [
            '@vuepress/google-analytics',
            {
                ga: '', // UA-00000000-0
            },
        ],
    ],
};
