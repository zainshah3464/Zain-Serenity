export function validateBookingInput({
  checkIn,
  checkOut,
  guests,
  price,
}: {
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
}) {
  const errors: string[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime())) errors.push("Invalid check‑in date");
  if (isNaN(checkOutDate.getTime())) errors.push("Invalid check‑out date");
  if (checkInDate < now) errors.push("Check‑in date cannot be in the past");
  if (checkOutDate <= checkInDate) errors.push("Check‑out must be after check‑in");
  if (guests < 1) errors.push("At least 1 guest required");
  if (price <= 0) errors.push("Invalid total price");

  return errors;
}