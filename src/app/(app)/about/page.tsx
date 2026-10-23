import { Container } from '@/components/Container';
import MDXComponents from '@/components/MDXComponents';
import { getPageBySlug } from '@/lib/posts';
import { MDXContent } from '@content-collections/mdx/react';
import { notFound } from 'next/navigation';

export function generateMetadata() {
	const post = getPageBySlug('about');
	if (!post) return {};
	const { title, description } = post;
	return {
		title,
		description,
		openGraph: { title, description },
		twitter: { title, description, card: 'summary_large_image' }
	};
}

const AboutPage = () => {
	const post = getPageBySlug('about');
	if (!post) notFound();

	return (
		<Container className="mt-16">
			<article className="rich-text-viewer max-w-3xl">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">{post.title}</h1>
				</div>
				<div className="markdown-body">
					<MDXContent code={post.body} components={MDXComponents} />
				</div>
			</article>
		</Container>
	);
};

export default AboutPage;
