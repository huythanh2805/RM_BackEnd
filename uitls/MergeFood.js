export function mergeCompletedFoodItems(foodItems) {
  // Tạo một map để lưu trữ món ăn đã gộp
  const mergedMap = new Map();

  // Duyệt qua từng món ăn trong mảng
  for (const item of foodItems) {
    const { dish_id, status, quantity } = item;

    // Lấy giá trị name từ dish_id
    const dishName = dish_id?.name;

    // Kiểm tra điều kiện status === "ISCOMPLETED"
    if (status === "ISCOMPLETED" && dishName) {
      // Nếu món ăn đã tồn tại trong map, cộng dồn quantity
      if (mergedMap.has(dishName)) {
        const existingItem = mergedMap.get(dishName);
        mergedMap.set(dishName, {
          ...existingItem,
          _doc: {
            ...existingItem._doc,
            quantity: existingItem._doc.quantity + quantity,
          },
        });
      } else {
        // Nếu chưa tồn tại, thêm món ăn vào map với dữ liệu từ _doc
        mergedMap.set(dishName, {
          ...item,
          _doc: {
            ...item._doc,
            quantity: quantity,
          },
        });
      }
    }
  }
  // Trả về mảng từ map, chỉ giữ _doc
  return Array.from(mergedMap.values()).map(item => item._doc);
}

export function mergeCompletedComboItems(foodItems) {
  // Tạo một map để lưu trữ món ăn đã gộp
  const mergedMap = new Map();

  // Duyệt qua từng món ăn trong mảng
  for (const item of foodItems) {
    const { setComboProduct_id, status, quantity } = item;

    // Lấy giá trị name từ dish_id
    const dishName = setComboProduct_id.combo_id?.name;

    // Kiểm tra điều kiện status === "ISCOMPLETED"
    if (status === "ISCOMPLETED" && dishName) {
      // Nếu món ăn đã tồn tại trong map, cộng dồn quantity
      if (mergedMap.has(dishName)) {
        const existingItem = mergedMap.get(dishName);
        mergedMap.set(dishName, {
          ...existingItem,
          _doc: {
            ...existingItem._doc,
            quantity: existingItem._doc.quantity + quantity,
          },
        });
      } else {
        // Nếu chưa tồn tại, thêm món ăn vào map với dữ liệu từ _doc
        mergedMap.set(dishName, {
          ...item,
          _doc: {
            ...item._doc,
            quantity: quantity,
          },
        });
      }
    }
  }
  // Trả về mảng từ map, chỉ giữ _doc
  return Array.from(mergedMap.values()).map(item => item._doc);
}