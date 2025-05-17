// Trigger rebuild: 2025-05-17
import Hero from "@/components/Hero";
import AiFeature from "@/components/AiFeature";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import ScrollUp from "@/components/Common/ScrollUp";

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <AiFeature />
      <Blog />
      <Contact />
    </>
  );
}
