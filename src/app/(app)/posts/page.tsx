import { Container } from '@/components/Container';
import { blogPosts } from '@/lib/posts';
import { PostsTimeline } from './PostsTimeline';

const title = '文章';
const description =
	'记录在编程学习、工作中遇到的问题，以及日常的所见所闻所想。涵盖前端开发、React、Next.js 等话题。';

export const metadata = {
	title,
	description,
	openGraph: { title, description },
	twitter: { title, description, card: 'summary_large_image' }
};

export default function Posts() {
	return (
		<Container className="mt-14 min-h-[50vh] sm:mt-20">
			<header className="max-w-2xl border-b border-border/70 pb-10">
				<p className="eyebrow">Archive</p>
				<h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
					文章
				</h1>
				<p className="mt-5 text-base leading-8 text-muted-foreground">
					记录工作、学习与生活中的所见所闻，主要分享<b className="font-medium text-foreground">前端开发</b>
					，偶尔也写点<b className="font-medium text-foreground">其他内容</b>。
				</p>
			</header>

			<PostsTimeline posts={blogPosts} />
		</Container>
	);
}
