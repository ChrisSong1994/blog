import { PeekabooLink } from '@/components/links/PeekabooLink';
import siteMetadata from '@/config/site';
import { withBasePath } from '@/lib/base-path';
import Image from 'next/image';
import Link from 'next/link';

const navigationItems = siteMetadata.navigationItems;

export function Footer() {
	const { authorsCN, repoUrl, beian } = siteMetadata;
	const year = new Date().getFullYear();

	return (
		<footer className="mt-24 border-t border-border/70">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
				<p className="text-[13px] text-muted-foreground">
					&copy; {year} {authorsCN}
					{repoUrl && (
						<>
							<span className="mx-2 text-border">/</span>
							<PeekabooLink
								href={repoUrl}
								className="text-muted-foreground transition-colors hover:text-foreground"
							>
								源码仓库
							</PeekabooLink>
						</>
					)}
				</p>

				<nav aria-label="页脚导航">
					<ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
						{navigationItems.map(({ href, text }) => (
							<li key={href}>
								<Link
									href={href}
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									{text}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			{beian && (
				<div className="border-t border-border/50 py-4">
					<Link
						target="_blank"
						href="https://beian.miit.gov.cn/"
						rel="noreferrer"
						className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
					>
						<Image
							unoptimized
							src={withBasePath('/police.png')}
							width={14}
							height={14}
							alt=""
							className="opacity-70"
						/>
						{beian}
					</Link>
				</div>
			)}
		</footer>
	);
}
