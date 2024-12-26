import { v4 as uuidv4 } from 'uuid';
const generateUUID = ()=>{
    const uuid = uuidv4(); // Tạo UUID
    const id = uuid.replace(/-/g, '').slice(0, 6); // Loại bỏ dấu gạch ngang và lấy 6 ký tự đầu tiên
    return id;
}

export {
    generateUUID
}