import cron from "node-cron";
import Reservation from "../models/reservation.js";

export const cancelPastReservations = async () => {
  try {
    const now = new Date();
    const expiredReservations = await Reservation.find({
      startTime: { $lt: now },
      status: { $in: ["ISWAITING", "ISCOMFIRMED", "ISPAYMENT"] },
    });
    for (const Reservation of expiredReservations) {
      Reservation.status = "CANCELED";
      await Reservation.save();
    }
    console.log(`Cron Job: Canceled ${expiredReservations.length} reservations.`);
  } catch (error) {
    console.error("Error in cancelPastReservations:", error);
  }
};
export const startCronJob = () => {
  cron.schedule("0 0 * * *", cancelPastReservations);
};
