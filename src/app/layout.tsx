import './globals.css';
import ProviderComponent from '@/components/layouts/provider-component';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Metadata } from 'next';

import { Nunito } from 'next/font/google';
import ContentAnimation from '@/components/layouts/content-animation';
import Footer from '@/components/layouts/footer';
import Header from '@/components/layouts/header';
import MainContainer from '@/components/layouts/main-container';
import Overlay from '@/components/layouts/overlay';
import ScrollToTop from '@/components/layouts/scroll-to-top';
import Setting from '@/components/layouts/setting';
import Sidebar from '@/components/layouts/sidebar';
import Portals from '@/components/portals';

export const metadata: Metadata = {
    title: {
        template: '%s | VRISTO - Multipurpose Tailwind Dashboard Template',
        default: 'VRISTO - Multipurpose Tailwind Dashboard Template',
    },
};
const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={nunito.variable}>
                <ProviderComponent>
                    <div className="relative">
                        <Overlay />
                        <ScrollToTop />

                        {/* BEGIN APP SETTING LAUNCHER */}
                        <Setting />
                        {/* END APP SETTING LAUNCHER */}

                        <MainContainer>
                            {/* BEGIN SIDEBAR */}
                            <Sidebar />
                            {/* END SIDEBAR */}
                            <div className="flex flex-col min-h-screen main-content">
                                {/* BEGIN TOP NAVBAR */}
                                <Header />
                                {/* END TOP NAVBAR */}

                                {/* BEGIN CONTENT AREA */}
                                <ContentAnimation>{children}</ContentAnimation>
                                {/* END CONTENT AREA */}

                                {/* BEGIN FOOTER */}
                                <Footer />
                                {/* END FOOTER */}
                                <Portals />
                            </div>
                        </MainContainer>
                    </div>
                </ProviderComponent>
            </body>
        </html>
    );
}
