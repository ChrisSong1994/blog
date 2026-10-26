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
		<Container className="mt-14 sm:mt-20">
			<article className="mx-auto w-full max-w-[46rem]">
				<header className="border-b border-border/70 pb-8">
					<p className="eyebrow">About</p>
					<h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-foreground">
						{post.title}
					</h1>
				</header>
				<div className="markdown-body mt-10">
					<MDXContent code={post.body} components={MDXComponents} />
				</div>
			</article>
		</Container>
	);
};

export default AboutPage;
