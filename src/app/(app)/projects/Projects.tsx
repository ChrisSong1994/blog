import React from 'react';
import { ProjectCard } from './ProjectCard';

/**
 * 项目列表。图标用 public/projects 下的图片路径，
 * 换项目时只改这个数组 + 替换图片，不需要动组件。
 */
export function Projects(): React.ReactElement {
	const projects: ProjectItem[] = [
		{
			id: '3',
			url: 'https://example.com/project-c',
			icon: '/projects/p1.png',
			name: '示例项目 A',
			description: '一句话说明这个项目做了什么，解决了什么问题。',
			tags: ['个人']
		},
		{
			id: '2',
			url: 'https://example.com/project-b',
			icon: '/projects/p2.png',
			name: '示例项目 B',
			description: '一句话说明这个项目做了什么，解决了什么问题。',
			tags: ['公司']
		},
		{
			id: '1',
			url: 'https://example.com/project-a',
			icon: '/projects/p3.png',
			name: '示例项目 C',
			description: '一句话说明这个项目做了什么，解决了什么问题。',
			tags: ['开源']
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
