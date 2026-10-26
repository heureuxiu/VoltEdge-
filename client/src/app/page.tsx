import { Container } from "@/components/ui/Container";
import { About } from "@/components/sections/About";
import { BestSellersCarousel } from "@/components/sections/BestSellersCarousel";
import { BuyerGuides } from "@/components/sections/BuyerGuides";
import { Categories } from "@/components/sections/Categories";
import { ContactCta } from "@/components/sections/ContactCta";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { Hero } from "@/components/sections/Hero";
import { PopularSearches } from "@/components/sections/PopularSearches";
import { QuickActions } from "@/components/sections/QuickActions";
import { Repairs } from "@/components/sections/Repairs";
import { Reviews } from "@/components/sections/Reviews";
import { TradeIn } from "@/components/sections/TradeIn";
import { WhyUs } from "@/components/sections/WhyUs";

export default function HomePage() {
  return (
    <>
    <Container className="pt-6">
      <Hero />
    </Container>
    <div className="mx-auto w-full max-w-[1348px] px-4 sm:px-6">
      <QuickActions />
      <BestSellersCarousel />
      <Categories />
      <FeaturedProducts />
      <Repairs />
      <TradeIn />
      <WhyUs />
      <About />
      <Reviews />
      <BuyerGuides />
      <PopularSearches />
      <ContactCta />
    </div>
    </>
  );
}
