import * as iconList from '@/assets/index';
import { Container } from '@/components/Container';
import type { IconProps } from '@/assets';

/** 站内所有图标的总览页，方便挑 icon 名去改 src/config/site.ts */
export default function IconPage() {
	return (
		<Container>
			<div className="flex flex-wrap gap-4">
				{Object.entries(iconList).map(([name, Icon]) => {
					if (typeof Icon !== 'function') return null;
					const IconComponent = Icon as React.ComponentType<IconProps>;
					return (
						<div key={name} className="mt-20 flex flex-col items-center">
							<IconComponent className="h-8 w-8" />
							<div className="text-xs">{name}</div>
						</div>
					);
				})}
			</div>
		</Container>
	);
}
