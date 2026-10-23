'use client';

import Script from 'next/script';

/** 百度统计，需在 .env.local 配置 NEXT_PUBLIC_BAIDU_TONGJI */
const BaiDuAnalytics = () => {
	const id = process.env.NEXT_PUBLIC_BAIDU_TONGJI;
	if (!id) return null;

	return (
		<>
			<Script
				id="baidu-tongji"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${id}";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
          })();
          `
				}}
			/>
		</>
	);
};

export default BaiDuAnalytics;
