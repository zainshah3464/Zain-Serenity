import ScrollReveal from "@/components/ScrollReveal";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Link from "next/link";
import WhyChooseUs from "@/components/WhyChooseUs";
import RoomCard from "@/components/RoomCard";
import ReviewCarousel from "@/components/ReviewCarousel";
import Gallery from "@/components/Gallery";
import LocationMap from "@/components/LocationMap";
import StoryHero from "@/components/StoryHero";
interface RoomData {
  _id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isFeatured?: boolean;
  rating?: number;
}

export default async function HomePage() {
  let rooms: RoomData[] = [];
  try {
    await dbConnect();
    const rawRooms = await Room.find({
      status: "active",
      isFeatured: true,
    })
      .limit(3)
      .lean();

    rooms = rawRooms.map((room: any) => ({
      _id: room._id.toString(),
      name: room.name,
      price: room.price,
      image: room.image,
      isNew: room.isNewRoom,
      isFeatured: room.isFeatured,
      rating: room.rating,
    }));
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
  }

  return (
    <div className="bg-[#FAFAFA]">
      <StoryHero/>

      <WhyChooseUs />


      <section className="py-16 max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-12">
            Our Featured Rooms
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.length > 0 ? (
              rooms.map((room) => <RoomCard key={room._id} room={room} />)
            ) : (
              <p className="col-span-3 text-center text-gray-500">
                No featured rooms available right now.
              </p>
            )}
          </div>
        </ScrollReveal>
      </section>

            <Gallery />  {/* new */}

      <section className="py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <ReviewCarousel />
          </ScrollReveal>
        </div>
      </section>

      <LocationMap />   {/* new */}
    </div>
  );
}