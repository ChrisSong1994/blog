import { Container } from '@/components/Container';
import { blogPosts } from '@/lib/posts';
import { PostsTimeline } from './PostsTimeline';

const title = '我的博客列表';
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
		<Container className="mt-16 min-h-[50vh]">
			<header className="mb-6 max-w-2xl">
				<h1 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
					我的 blog
				</h1>
				<p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
					记录工作，学习，生活中的所见所闻所想，主要分享领域 <b>前端开发</b>
					，偶尔也会记录 <b>其他内容</b>
				</p>
			</header>
			<PostsTimeline posts={blogPosts} />
		</Container>
	);
}
