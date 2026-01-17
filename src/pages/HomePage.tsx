import { useQuery } from '@tanstack/react-query';
import { getShelves } from '../api/endpoints';
import { CategoryStrip } from '../components/home/CategoryStrip';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { ProductShelf } from '../components/home/ProductShelf';
import { CategorySidebar } from '../components/layout/CategorySidebar';
import { ShelfSkeleton } from '../components/ui/Skeleton';
import { HowItWorks } from '../components/footer/HowItWorks';
import { PopularSearches } from '../components/footer/PopularSearches';
import { FooterCategories } from '../components/footer/FooterCategories';
import { SiteFooter } from '../components/footer/SiteFooter';
import { useEffect, useState } from 'react';

export function HomePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const { data: shelves, isLoading } = useQuery({
    queryKey: ['shelves'],
    queryFn: getShelves,
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-6">
            {isDesktop && <CategorySidebar />}

            <main className="flex-1 min-w-0">
              <div className="lg:hidden mb-6">
                <CategoryStrip />
              </div>

              <div className="mb-6">
                <BannerCarousel />
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <>
                    <ShelfSkeleton />
                    <ShelfSkeleton />
                    <ShelfSkeleton />
                  </>
                ) : (
                  shelves?.map((shelf) => (
                    <ProductShelf key={shelf._id || shelf.id} shelf={shelf} isDesktop={isDesktop} />
                  ))
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      <HowItWorks />
      <PopularSearches />
      <FooterCategories />
      <SiteFooter />
    </>
  );
}
