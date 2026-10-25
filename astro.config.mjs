// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
	// 站点同时部署到 GitHub Pages 与 Cloudflare Pages，两者都用根路径：
	//   - Cloudflare Pages：规范域名（canonical），默认根目录。
	//   - GitHub Pages：备用入口，仓库已重命名为 shoumingeneralist.github.io（用户页）。
	//
	// site 必须写规范域名：Astro 用它生成 <link rel="canonical"> 和 sitemap，
	// 这样即使访客从 github.io 进来，搜索引擎也只会收录 pages.dev 这一份，
	// 不会把「守民通识」的排名信号分散到两个域名上。
	//
	// 默认 base 为 '/'；如需切回子路径部署，可设置环境变量 BASE 覆盖，例如 BASE=/ShouminGeneralist/。
	base: process.env.BASE || '/',
	site: 'https://shoumingeneralist.pages.dev',
	markdown: {
		// Astro 7 默认用 Sätteri 处理器，它不跑 rehype 插件，所以这里显式切到 unified
		// （@astrojs/markdown-remark），再把 rehype-external-links 挂上去。
		processor: unified({
			rehypePlugins: [
				// 让正文里指向外部域名的链接自动在新标签页打开，并加上
				// noopener / noreferrer，防止新页面通过 window.opener 反向控制本站。
				[
					rehypeExternalLinks,
					{
						target: '_blank',
						rel: ['noopener', 'noreferrer'],
						// 除 http(s) 外，邮件 / 电话链接也走新窗口，不在当前页跳走
						protocols: ['http', 'https', 'mailto', 'tel'],
					},
				],
			],
		}),
	},
	integrations: [
		starlight({
			title: '守民通识',
			// 控制在 150 字以内：搜索引擎摘要通常截断到 155 字符左右，
			// 太长会被切掉，且品牌名「守民通识」必须出现在最前面。
			description:
				'守民通识：无偿分享近 20 年跨领域研发实战经验，覆盖机械、电机控制、电子、软硬件与计算机，深耕家电头部企业，持有 80 余项专利，倡导自主学习与独立思考。',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/shoumingeneralist' }],

			// 结构化数据：把「守民通识」作为明确的实体告诉搜索引擎，
			// 有助于 Google / Bing 建立站点实体认知（知识面板、站点名称展示）。
			head: [
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify({
						'@context': 'https://schema.org',
						'@graph': [
							{
								'@type': 'WebSite',
								'@id': 'https://shoumingeneralist.pages.dev/#website',
								url: 'https://shoumingeneralist.pages.dev/',
								name: '守民通识',
								description:
									'无偿分享近 20 年跨领域研发实战经验，覆盖机械、电机控制、电子、软硬件与计算机。以通识研发为方向，关注新知识新技术积累。',
								inLanguage: 'zh-CN',
								publisher: { '@id': 'https://shoumingeneralist.pages.dev/#organization' },
							},
							{
								'@type': 'Organization',
								'@id': 'https://shoumingeneralist.pages.dev/#organization',
								name: '守民通识',
								alternateName: ['守民通识 Shoumin Generalist'],
								url: 'https://shoumingeneralist.pages.dev/',
								logo: 'https://shoumingeneralist.pages.dev/favicon.svg',
								sameAs: ['https://github.com/shoumingeneralist'],
							},
						],
					}),
				},
			],

			// 覆写默认页脚：在「编辑此页 / 上一页下一页」之后再挂一个全站统一的联系方式区块。
			// 内容只维护在 src/components/ContactSection.astro 一份，所有页面自动生效。
			components: {
				Footer: './src/components/Footer.astro',
			},

			// 自定义样式：目前用于压紧页面末尾「今日发布 / 站点 / 图文教程」链接区
			customCss: ['./src/styles/custom.css'],

			 // 将网站默认语言设置为简体中文
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },

			sidebar: [
			{
					label: '初衷',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: '关于本站', slug: 'thought/start' },
					],
				},
				{
					label: '自媒体之路',
					items: [
						{ autogenerate: { directory: 'selfmediapath' } },
					],
				},
			],
		}),
	],
});
