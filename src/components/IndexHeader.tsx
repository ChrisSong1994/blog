'use client';

import { SocialLink } from '@/components/links/SocialLink';
import siteMetadata from '@/config/site';
import { motion } from 'motion/react';

const roles = ['前端开发', '开源爱好者', 'AI 深度患者', 'AI 全栈工程师'];

const fadeUp = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 }
};

export function Headline() {
	return (
		<section className="pt-16 pb-14 sm:pt-24 sm:pb-20">
			<motion.p
				className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground"
				{...fadeUp}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
			>
				{'<卷尺 />'}
			</motion.p>

			<motion.h1
				className="mt-6 max-w-3xl font-serif text-4xl leading-[1.15] font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl"
				{...fadeUp}
				transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
			>
				你好，我是{siteMetadata.authorsCN}
				<span className="text-brand">.</span>
			</motion.h1>

			<motion.p
				className="mt-6 max-w-xl text-base leading-8 text-muted-foreground"
				{...fadeUp}
				transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
			>
				{siteMetadata.description}
			</motion.p>

			<motion.div
				className="mt-7 flex flex-wrap items-center gap-y-2 text-[13px] text-muted-foreground"
				{...fadeUp}
				transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
			>
				{roles.map((role, index) => (
					<span key={role} className="inline-flex items-center">
						{index > 0 && (
							<span
								aria-hidden="true"
								className="mx-3 h-3 w-px bg-border"
							/>
						)}
						{role}
					</span>
				))}
			</motion.div>

			<motion.div
				className="mt-9 flex flex-wrap items-center gap-5"
				{...fadeUp}
				transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
			>
				{siteMetadata.social.map((item) =>
					item.hide ? null : (
						<SocialLink
							isPicture={item.isPicture}
							key={item.href}
							href={item.href}
							icon={item.icon}
							aria-label={item.text}
							platform={item.text}
						/>
					)
				)}
			</motion.div>
		</section>
	);
}
