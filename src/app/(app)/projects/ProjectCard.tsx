'use client';

import { ExternalLinkIcon } from '@/assets';
import Tag from '@/components/Tag';
import { Card } from '@/components/ui/Card';
import { withBasePath } from '@/lib/base-path';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import Image from 'next/image';
import React from 'react';

export function ProjectCard({ project }: { project: ProjectItem }) {
	const { id, url, icon, name, tags, description } = project;

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const radius = useMotionValue(0);

	const handleMouseMove = React.useCallback(
		({ clientX, clientY, currentTarget }: React.MouseEvent) => {
			const bounds = currentTarget.getBoundingClientRect();
			mouseX.set(clientX - bounds.left);
			mouseY.set(clientY - bounds.top);
			radius.set(Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2);
		},
		[mouseX, mouseY, radius]
	);

	/** 悬浮时跟随光标的紫色光晕 */
	const spotlight = useMotionTemplate`radial-gradient(circle ${radius}px at ${mouseX}px ${mouseY}px, rgb(139 92 246 / 0.1), transparent 65%)`;

	const host = url ? new URL(url).host : '';

	return (
		<Card
			as="li"
			key={id}
			onMouseEnter={handleMouseMove}
			onMouseMove={handleMouseMove}
		>
			{/* 光标跟随的光晕 + 高亮描边，z-[1] 盖住悬浮底色、位于内容之下 */}
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute -inset-x-4 -inset-y-6 z-[1] border border-violet-500/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:border-violet-400/30"
				style={{ background: spotlight }}
			/>
			<div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 transition-transform duration-300 group-hover:scale-110 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
				<Image
					src={withBasePath(icon ?? '')}
					alt=""
					width={36}
					height={36}
					className="h-9 w-9 rounded-full"
					unoptimized
				/>
			</div>
			<h2 className="mt-6 text-base font-bold text-zinc-800 transition-colors group-hover:text-violet-600 dark:text-zinc-100 dark:group-hover:text-violet-400">
				<Card.Link href={url ?? ''} target="_blank">
					{name}
				</Card.Link>
			</h2>
			<Card.Description>{description}</Card.Description>
			<div className="mt-4">
				{tags?.map((tag) => (
					<Tag key={tag}>{tag}</Tag>
				))}
			</div>
			<p className="pointer-events-none relative z-40 mt-6 flex items-center text-sm font-medium text-zinc-400 transition group-hover:-translate-y-0.5 group-hover:text-violet-600 dark:text-zinc-200 dark:group-hover:text-violet-400">
				<span className="mr-2">{host}</span>
				<ExternalLinkIcon className="h-4 w-4 flex-none" />
			</p>
		</Card>
	);
}
