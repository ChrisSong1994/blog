import * as iconList from '@/assets/index';
import { Container } from '@/components/Container';
import type { IconProps } from '@/assets';

/** 站内所有图标的总览页，方便挑 icon 名去改 src/config/site.ts */
export default function IconPage() {
	return (
		<Container className="mt-16">
			<header className="mb-10 border-b border-border/70 pb-8">
				<p className="eyebrow">Icons</p>
				<h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight">
					图标库
				</h1>
			</header>
			<div className="flex flex-wrap gap-4">
				{Object.entries(iconList).map(([name, Icon]) => {
					if (typeof Icon !== 'function') return null;
					const IconComponent = Icon as React.ComponentType<IconProps>;
					return (
						<div key={name} className="flex flex-col items-center gap-2 py-6">
							<IconComponent className="h-7 w-7 text-muted-foreground" />
							<div className="font-mono text-[10px] text-muted-foreground">
								{name}
							</div>
						</div>
					);
				})}
			</div>
		</Container>
	);
}
