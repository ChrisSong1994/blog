import { Manrope, Source_Serif_4 } from 'next/font/google';

/** UI / 正文用的无衬线字体（Latin 部分，中文回落到系统字体） */
const sansFont = Manrope({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700', '800'],
	variable: '--font-manrope',
	display: 'swap'
});

/** 标题用的衬线字体：中文回落到宋体系，撑起杂志式的阅读气质 */
const serifFont = Source_Serif_4({
	subsets: ['latin'],
	variable: '--font-source-serif',
	display: 'swap'
});

export { sansFont, serifFont };
