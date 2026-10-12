import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { MenuSection } from "@/components/menu-section";
import { Navbar } from "@/components/navbar";
import { ReservationProvider } from "@/components/reservation-context";
import { ReservationDialog } from "@/components/reservation-dialog";
import { Story } from "@/components/story";
import { TrayButton } from "@/components/tray-button";
import { getMenu } from "@/lib/api";

export default async function Home() {
  const menu = await getMenu();

  return (
    <ReservationProvider>
      <Navbar />
      <main className="flex-1 overflow-x-clip">
        <Hero />
        <Story />
        <MenuSection menu={menu} />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <TrayButton />
      <ReservationDialog />
    </ReservationProvider>
  );
}
