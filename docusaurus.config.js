// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import sidebarItemsGenerator from './sidebarItemsGenerator.js';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'tcms-fusion',
  tagline: 'all in one place',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://fusion.tcms.ai',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // 👇 Important: force canonical URLs with a trailing slash
  trailingSlash: true,

  // GitHub pages deployment config.
  organizationName: 'aot-technologies', // Usually your GitHub org/user name.
  projectName: 'tcms-fusion', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          sidebarItemsGenerator, // ← pass the function, not a string
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'tcms logo',
          src: 'img/tcms_logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {
            label: "What's new!",
            position: 'left',
            items: [
              { to: '/docs/changelog-mobile', label: "What's New: Mobile" },
              { to: '/docs/changelog-web', label: "What's New: Web" },
            ],
          },
          { type: 'search', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Aot Technologies Sdn Bhd, MY.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: {
        appId: 'XD9T316235',
        apiKey: 'f22dce6b71ed1f24f2d640cbb97d15c8', // Use the **Search-Only API Key**
        indexName: 'tcms fusion',
        contextualSearch: true, // enables contextual search
        searchParameters: {},   // pass custom search params if needed
      },
    }),

  plugins: [
    [require.resolve('@cmfcmf/docusaurus-search-local')],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/intro', // The path you want to serve as the home page
            from: ['/'],       // The root path
          },
        ],
      },
    ],
  ],
};

export default config;