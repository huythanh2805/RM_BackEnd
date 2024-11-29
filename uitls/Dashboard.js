function GetDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

const getBillQuantitiesByDay = (bills, selectedMonth, selectedYear) => {
  const today = new Date(); // Lấy ngày hiện tại
  const currentDay = today.getDate(); // Lấy ngày trong tháng (1-31)
  const month = today.getMonth();  // Lấy tháng hiện tại (0-11)

  // Lấy số ngày trong tháng hiện tại
  const daysInMonth = GetDaysInMonth(selectedMonth, selectedYear);

  // Mảng chứa tổng tiền mỗi ngày (từ ngày 1 đến ngày cuối cùng của tháng)
  const dailyQuantities = Array.from({ length: daysInMonth }, (_, index) => ({
    day: index + 1,
    total_money: 0,  // Thay `quantity` bằng `total_money`
  }));

  // Đếm tổng tiền theo từng ngày
  bills.forEach(bill => {
    const billDate = new Date(bill.createdAt);
    const billDay = billDate.getDate();  // Lấy ngày trong tháng từ createdAt

    // Kiểm tra xem ngày của bill có nhỏ hơn hoặc bằng ngày hiện tại không
    if (billDate <= today) {
      // Nếu có, cộng tổng tiền của bill cho ngày tương ứng
      const totalMoney = bill.original_money;  // Lấy giá trị original_money từ bill
      dailyQuantities[billDay - 1].total_money += totalMoney;  // Cộng vào `total_money` tương ứng với ngày
    }
  });
  // Nếu ngày hiện tại < số ngày của tháng thì chỉ tính đến ngày hiện tại
  if (currentDay < daysInMonth && month + 1 === Number(selectedMonth)) {
    dailyQuantities.splice(currentDay, daysInMonth - currentDay);
  }

  return dailyQuantities;
};
const getReservationStatusesByDay = (reservations, selectedMonth, selectedYear) => {
  const today = new Date(); // Lấy ngày hiện tại
  const currentDay = today.getDate(); // Lấy ngày trong tháng (1-31)
  const month = today.getMonth(); // Lấy tháng hiện tại (0-11)

  // Lấy số ngày trong tháng hiện tại
  const daysInMonth = GetDaysInMonth(selectedMonth, selectedYear);

  // Mảng chứa số lượng đơn hoàn thành và bị hủy mỗi ngày (từ ngày 1 đến ngày cuối cùng của tháng)
  const dailyStatuses = Array.from({ length: daysInMonth }, (_, index) => ({
    day: index + 1,
    canceled: 0,  // Số đơn bị hủy
    completed: 0,  // Số đơn thành công
  }));

  // Đếm số lượng trạng thái (canceled, completed) theo từng ngày
  reservations.forEach(reservation => {
    const reservationDate = new Date(reservation.createdAt);  // Lấy ngày tạo đơn từ createdAt
    const reservationDay = reservationDate.getDate(); // Lấy ngày trong tháng từ createdAt
    const reservationStatus = reservation.status; // Trạng thái của đơn: 'canceled' hoặc 'completed'

    // Kiểm tra xem ngày của reservation có nhỏ hơn hoặc bằng ngày hiện tại không
    if (reservationDate <= today) {
      // Nếu có, tăng số lượng đơn cho trạng thái tương ứng
      if (reservationStatus === 'CANCELED') {
        dailyStatuses[reservationDay - 1].canceled += 1;  // Tăng số đơn bị hủy
      } else if (reservationStatus === 'COMPLETED') {
        dailyStatuses[reservationDay - 1].completed += 1;  // Tăng số đơn hoàn thành
      }
    }
  });

  // Nếu ngày hiện tại < số ngày của tháng thì chỉ tính đến ngày hiện tại
  if (currentDay < daysInMonth && month + 1 === Number(selectedMonth)) {
    dailyStatuses.splice(currentDay, daysInMonth - currentDay);
  }

  return dailyStatuses;
};
export {
    getBillQuantitiesByDay,
    getReservationStatusesByDay
}