import { PeekabooLink } from '@/components/links/PeekabooLink';
import siteMetadata from '@/config/site';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Container } from './Container';

const navigationItems = siteMetadata.navigationItems;

function NavLink({
	href,
	children
}: {
	href: string;
	children: React.ReactNode;
}) {
	return (
		<Link
			href={href}
			className="transition hover:text-violet-500 dark:hover:text-violet-400"
		>
			{children}
		</Link>
	);
}

function Links() {
	return (
		<nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
			{navigationItems.map(({ href, text }) => (
				<NavLink key={href} href={href}>
					{text}
				</NavLink>
			))}
		</nav>
	);
}

export function Footer() {
	const { authorsCN, repoUrl, beian } = siteMetadata;

	return (
		<footer className="mt-32">
			<Container.Outer>
				<div className="border-t border-zinc-100 pt-10 pb-16 dark:border-zinc-700/40">
					<Container.Inner>
						<div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
							<p className="text-sm text-zinc-500/80 dark:text-zinc-400/80">
								&copy; {new Date().getFullYear()} {authorsCN}
								{repoUrl && (
									<>
										&nbsp;网站已开源：
										<PeekabooLink href={repoUrl}>源码仓库</PeekabooLink>
									</>
								)}
							</p>
							<Links />
						</div>
					</Container.Inner>
					<Container.Inner className="mt-6">
						<div className="flex flex-col items-center justify-start gap-2 sm:flex-row">
							欢迎 👏🏻 你的访问
						</div>
					</Container.Inner>
					{beian && (
						<Link
							target="_blank"
							href="https://beian.miit.gov.cn/"
							className="absolute bottom-6 left-1/2 flex w-full -translate-x-1/2 items-center justify-center text-blue-600"
						>
							<Image
								unoptimized
								src={'/police.png'}
								width={18}
								height={18}
								alt="备案"
								className="mr-1"
							/>
							{beian}
						</Link>
					)}
				</div>
			</Container.Outer>
		</footer>
	);
}
