import React from 'react';
import { ProjectCard } from './ProjectCard';

/**
 * 项目列表。图标用 public/projects 下的图片路径，
 * 换项目时只改这个数组 + 替换图片，不需要动组件。
 */
export function Projects(): React.ReactElement {
	const projects: ProjectItem[] = [
		{
			id: '9',
			url: 'https://chrissong1994.github.io/WizSync/',
			icon: '/projects/wizsync.png',
			name: 'WizSync',
			description:
				'基于 Unison 算法的目录同步工具，支持双向同步、实时监控与可视化仪表盘，内置冲突与嵌套保护。',
			tags: ['开源', '桌面应用']
		},
		{
			id: '8',
			url: 'https://github.com/ChrisSong1994/sql-translator',
			icon: '/projects/sql-translator.svg',
			name: 'SQL Translator',
			description:
				'以 SQL 为统一查询语言的数据库兼容层，支持 MySQL、PostgreSQL、SQLite、MongoDB 等，内置连接池、事务与查询结果缓存。',
			tags: ['开源', 'npm 包']
		},
		{
			id: '7',
			url: 'https://chrissong1994.github.io/Navigator/',
			icon: '/projects/navigator.svg',
			name: '导航精灵',
			description:
				'可跨设备同步配置、支持全局搜索的 Chrome 新标签页导航主页，支持书签导航管理与常用小工具。',
			tags: ['开源', 'Chrome 插件']
		},
		{
			id: '6',
			url: 'https://chrissong1994.github.io/developer-assistant/',
			icon: '/projects/developer-assistant.png',
			name: 'Developer Assistant',
			description:
				'开源的开发工具集客户端，内置 JSON 处理、颜色拾取转换、编码、文本 diff 等常用工具。',
			tags: ['开源', '桌面应用']
		},
		{
			id: '5',
			url: 'https://chrissong1994.github.io/JexPath/',
			icon: '/projects/jexpath.svg',
			name: 'JexPath',
			description:
				'结合 JSONPath 的 JavaScript 表达式语言，附在线 Playground，可交互式编写与调试表达式。',
			tags: ['开源', '工具库']
		},
		{
			id: '4',
			url: 'https://github.com/ChrisSong1994/MihoX',
			icon: '/projects/mihox.png',
			name: 'MihoX',
			description:
				'基于 Next.js 与 Mihomo 的一体化网络控制中心，集成专业代理管理与系统配置。',
			tags: ['开源', 'Web 应用']
		}
	];

	return (
		<ul
			role="list"
			className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
		>
			{projects.map((project) => (
				<ProjectCard project={project} key={project.id} />
			))}
		</ul>
	);
}
