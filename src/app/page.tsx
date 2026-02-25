import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { BrandMatrix } from "@/components/sections/BrandMatrix";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DemoVideo } from "@/components/sections/DemoVideo";
import { PptShowcase } from "@/components/sections/PptShowcase";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <BrandMatrix />
      <HowItWorks />
      <DemoVideo />
      <PptShowcase />
    </div>
  );
}
