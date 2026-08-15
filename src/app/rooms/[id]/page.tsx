import dbConnect from "@/lib/dbConnect";
import Room from "@/models/Room";
import Review from "@/models/Review";
import User from "@/models/User";
import Booking from "@/models/Booking";
import RoomDetailContent from "@/components/RoomDetailContent";

async function getRoom(id: string) {
  await dbConnect();
  const room = await Room.findById(id).lean();
  if (!room) return null;
  const plain = JSON.parse(JSON.stringify(room));
  plain.isNew = plain.isNewRoom;
  delete plain.isNewRoom;
  return plain;
}

async function getReviews(roomId: string) {
  await dbConnect();
  const reviews = await Review.find({ roomId })
    .sort({ createdAt: -1 })
    .lean();
  const plain = JSON.parse(JSON.stringify(reviews));

  // Fix: explicitly collect string userIds
  const userIds: string[] = [...new Set(
    plain
      .map((r: any) => r.userId?.toString())
      .filter(Boolean)
  )] as string[];

  const users = userIds.length > 0
    ? await User.find({ _id: { $in: userIds } }).select("name email").lean()
    : [];
  const userMap: Record<string, { name: string; email: string }> = {};
  users.forEach((u: any) => {
    userMap[u._id.toString()] = { name: u.name, email: u.email };
  });

  return plain.map((r: any) => ({
    ...r,
    user: r.userId ? userMap[r.userId.toString()] || null : null,
    userId: r.userId?.toString(),
  }));
}

async function getUpcomingBookings(roomId: string) {
  await dbConnect();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookings = await Booking.find({
    roomId,
    checkOut: { $gte: today },
    status: { $ne: "cancelled" },
  }).sort({ checkIn: 1 }).lean();
  return JSON.parse(JSON.stringify(bookings));
}

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const room = await getRoom(id);
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-teal-50/20 to-white">
        <p className="text-gray-500 text-xl">Room not found.</p>
      </div>
    );
  }

  const reviews = await getReviews(id);
  const upcomingBookings = await getUpcomingBookings(id);

  return (
    <RoomDetailContent
      room={room}
      reviews={reviews}
      upcomingBookings={upcomingBookings}
    />
  );
}