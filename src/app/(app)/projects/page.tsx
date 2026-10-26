import { Container } from '@/components/Container';
import { type Metadata } from 'next';
import { Projects } from './Projects';

const title = '我的项目';
const description =
	'我在工作和自己学习过程中开发的一些项目，主要是前端领域，包含企业级应用、开源工具与个人作品。';

export const metadata = {
	title,
	description,
	openGraph: { title, description },
	twitter: { title, description, card: 'summary_large_image' }
} satisfies Metadata;

export default function ProjectsPage() {
	return (
		<Container className="mt-14 sm:mt-20">
			<header className="max-w-2xl border-b border-border/70 pb-10">
				<p className="eyebrow">Projects</p>
				<h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					项目
				</h1>
				<p className="mt-5 text-base leading-8 text-muted-foreground">
					这是我在开发和维护的项目，有<b className="font-medium text-foreground">公司项目</b>
					，也有<b className="font-medium text-foreground">个人项目</b>。
				</p>
			</header>

			<div className="mt-12">
				<Projects />
			</div>
		</Container>
	);
}
