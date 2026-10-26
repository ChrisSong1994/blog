import Tag from '@/components/Tag';
import { withBasePath } from '@/lib/base-path';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function ProjectCard({ project }: { project: ProjectItem }) {
	const { id, url, icon, name, tags, description } = project;
	const host = url ? new URL(url).host : '';

	return (
		<li
			key={id}
			className="group relative flex h-full flex-col rounded-lg border border-border/80 bg-surface/60 p-6 transition-colors hover:border-brand/35 hover:bg-surface"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border/70 bg-background p-1.5">
					<Image
						src={withBasePath(icon ?? '')}
						alt=""
						width={40}
						height={40}
						className="size-full rounded-sm object-contain"
						unoptimized
					/>
				</div>
				<ArrowUpRight
					className="size-4 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
					aria-hidden="true"
				/>
			</div>

			<h2 className="mt-5 font-serif text-lg font-semibold tracking-tight text-foreground">
				<Link
					href={url ?? '#'}
					target="_blank"
					rel="noreferrer"
					className="after:absolute after:inset-0 after:z-10 after:content-['']"
				>
					{name}
				</Link>
			</h2>

			<p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
				{description}
			</p>

			{tags?.length ? (
				<div className="mt-5 flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Tag key={tag}>{tag}</Tag>
					))}
				</div>
			) : null}

			<p className="mt-5 border-t border-border/50 pt-4 font-mono text-[11px] tracking-wide text-muted-foreground">
				{host}
			</p>
		</li>
	);
}
