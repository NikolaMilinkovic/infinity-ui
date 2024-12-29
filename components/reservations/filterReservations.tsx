import { OrderTypes } from '../../types/allTsTypes'
import { betterConsoleLog } from '../../util-methods/LogMethods';

function filterReservations(data: OrderTypes[]) {
  // console.log('> Filter reservations called');

  const dates = new Set();
  const reservations = [];

  for (const reservation of data) {
    if (reservation.reservation && reservation.reservationDate) {
      if (dates.has(reservation.reservationDate)) {
        for (const reservationObj of reservations) {
          if (
            reservationObj &&
            reservationObj.date === reservation.reservationDate
          ) {
            reservationObj.reservations.push(reservation);
          }
        }
      } else {
        dates.add(reservation.reservationDate);
        reservations.push({
          date: reservation.reservationDate,
          reservations: [reservation],
        });
      }
    }
  }

  // betterConsoleLog('> Logging sorted reservations by date:', reservations);
  return reservations;
}

export default filterReservations
