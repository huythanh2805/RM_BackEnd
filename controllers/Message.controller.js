import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js'; // Giả sử model User để tìm các admin

/**
 * Hàm tạo hoặc lấy conversation cho một senderId
 * @param {String} senderId - ID của người gửi tin nhắn
 * @param {String} text - Nội dung tin nhắn đầu tiên
 * @returns {Object} - Đối tượng conversation và message
 */
const CreateMessager = async (req, res) => {
  const  {senderId, text, conservationId} = req.body
  try {
    // Tạo và lưu tin nhắn mới vào database
    const message = await Message.create({
      conversationId: conservationId,
      senderId,
      text,
    });

    return res.status(201).json({ message});
  } catch (error) {
    console.error('Error in createOrGetConversation:', error);
    throw new Error('Failed to create or get conversation');
  }
};
/**
 * Hàm lấy tất cả các tin nhắn dựa trên conversationId
 * @param {String} conversationId - ID của cuộc trò chuyện
 * @returns {Array} - Danh sách các tin nhắn
 */
const getMessagesByConversationId = async ( req, res) => {
  const {conversationId} = req.params
  try {
    // Tìm tất cả các tin nhắn có conversationId phù hợp
    const messages = await Message.find({ conversationId }).populate('senderId').sort({ timestamp: 1 });
    return res.status(201).json({messages});
  } catch (error) {
    console.error('Error in getMessagesByConversationId:', error);
    throw new Error('Failed to get messages');
  }
};



const getConversationWithMessagesByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Tìm conversation có userId
    const conversation = await Conversation.findOne({ userId });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Tìm tất cả messages liên quan đến conversation
    const messages = await Message.find({ conversationId: conversation._id })
      .populate("senderId")
      .sort({ timestamp: 1 }); // Sắp xếp tin nhắn theo thứ tự thời gian tăng dần

    // Trả về conversation và messages
    res.status(200).json({
      conversationId: conversation._id ,
      messages,
    });
  } catch (error) {
    console.error('Error in getConversationWithMessagesByUserId:', error);
    res.status(500).json({ error: 'Failed to get conversation with messages' });
  }
}
const deleteAll = async () =>{
  await Message.deleteMany({})
  await Conversation.deleteMany({})
}
export {
    CreateMessager ,
    getMessagesByConversationId,
    getConversationWithMessagesByUserId,
    deleteAll
    };
