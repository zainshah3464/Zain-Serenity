import dbConnect from "./dbConnect";
import Booking from "@/models/Booking";

export async function isRoomAvailable(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  await dbConnect();
  const overlappingBooking = await Booking.findOne({
    roomId,
    status: { $ne: "cancelled" }, // cancelled bookings don't block
    $or: [
      { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }, // any overlap
    ],
  });
  return !overlappingBooking;
}