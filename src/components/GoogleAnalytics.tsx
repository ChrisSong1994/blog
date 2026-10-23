'use client';

import Script from 'next/script';

/** Google Analytics 4，需在 .env.local 配置 NEXT_PUBLIC_GOOGLE_ID */
const GoogleAnalytics = () => {
	const id = process.env.NEXT_PUBLIC_GOOGLE_ID;
	if (!id) return null;

	return (
		<>
			<Script
				strategy="afterInteractive"
				src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
			/>
			<Script
				id="gtag-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', {
              page_path: window.location.pathname,
            });
          `
				}}
			/>
		</>
	);
};

export default GoogleAnalytics;
