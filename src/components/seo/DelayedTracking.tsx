"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

interface DelayedTrackingProps {
    gaId?: string;
    gtmId?: string;
    metaPixelId?: string;
    hubspotId?: string;
}

export default function DelayedTracking({ gaId, gtmId, metaPixelId, hubspotId }: DelayedTrackingProps) {
    const [interacted, setInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setInteracted(true);
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("mousemove", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
        };

        window.addEventListener("scroll", handleInteraction, { passive: true });
        window.addEventListener("mousemove", handleInteraction, { passive: true });
        window.addEventListener("touchstart", handleInteraction, { passive: true });
        window.addEventListener("keydown", handleInteraction, { passive: true });

        // Fallback: If no interaction, load scripts after 8 seconds anyway
        const timeout = setTimeout(() => {
            setInteracted(true);
        }, 8000);

        return () => {
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("mousemove", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            clearTimeout(timeout);
        };
    }, []);

    if (!interacted) return null;

    return (
        <>
            {/* Google Analytics */}
            {gaId && (
                <>
                    <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
                    <Script strategy="lazyOnload" id="google-analytics">
                        {`
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${gaId}');
                        `}
                    </Script>
                </>
            )}

            {/* Google Tag Manager */}
            {gtmId && (
                <Script id="google-tag-manager" strategy="lazyOnload">
                    {`
                        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','${gtmId}');
                    `}
                </Script>
            )}

            {/* Meta Pixel Code */}
            {metaPixelId && (
                <Script id="meta-pixel" strategy="lazyOnload">
                    {`
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${metaPixelId}');
                        fbq('track', 'PageView');
                    `}
                </Script>
            )}

            {/* HubSpot Tracking Code */}
            {hubspotId && (
                <Script
                    id="hs-script-loader"
                    strategy="lazyOnload"
                    src={`//js.hs-scripts.com/${hubspotId}.js`}
                />
            )}
        </>
    );
}
