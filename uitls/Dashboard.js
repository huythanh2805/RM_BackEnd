
export const transformBills = (bills) => {
  const result = bills.reduce((acc, bill) => {
    const date = new Date(bill.createdAt).getDate(); // Lấy phần ngày (chỉ số ngày trong tháng)
    const total_money = bill.total_money;  // Chuyển từ money thành total_money

    // Kiểm tra nếu ngày đã có trong mảng kết quả
    const existingDay = acc.find(item => item.day === date);
    if (existingDay) {
      // Nếu ngày đã tồn tại, cộng tiền vào
      existingDay.total_money += total_money;
    } else {
      // Nếu chưa có ngày này, tạo mới
      acc.push({ day: date, total_money });
    }

    return acc;
  }, []);

  return result;
};

export const transformReservationStatusQuantity = (reservations) => {
  return reservations.reduce((acc, reservation) => {
    // Lấy ngày từ createdAt (chỉ lấy ngày trong tháng)
    const day = new Date(reservation.createdAt).getDate(); // Lấy phần ngày trong tháng (1-31)

    // Kiểm tra trạng thái và cập nhật số lượng tương ứng
    const statusCount = reservation.status === 'COMPLETED' ? 'completed' : 
                        reservation.status === 'CANCELED' ? 'canceled' : null;

    // Kiểm tra nếu ngày đã có trong mảng kết qu
    const existingDay = acc.find(item => item.day === day);

    if (existingDay) {
      // Nếu ngày đã tồn tại, cộng số lượng tương ứng
      if (statusCount) {
        existingDay[statusCount] += 1;
      }
    } else {
      // Nếu chưa có ngày này, tạo mới với số lượng mặc định là 0
      acc.push({
        day: day,
        canceled: statusCount === 'canceled' ? 1 : 0,
        completed: statusCount === 'completed' ? 1 : 0
      });
    }

    return acc;
  }, []);
};
