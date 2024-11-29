import Conversation from '../models/conversation.js';
import Message from '../models/message.js';

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
    if(!conversationId || conversationId === 'undefined') return res.status(401).json({message: 'Conversation Id must be required'})
    // Tìm tất cả các tin nhắn có conversationId phù hợp
    const messages = await Message.find({ conversationId }).populate('senderId').sort({ timestamp: 1 });
    console.log({messages})
    return res.status(201).json({messages});
  } catch (error) {
    console.error('Error in getMessagesByConversationId:', error);
    throw new Error('Failed to get messages');
  }
};

// Lấy conversation và tin nhắn dựa trên userId
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
// Lấy những tin nhắn chưa được xem dựa trên adminId
const getUnseenMessageCountAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const conversations = await Conversation.find({ adminIds: adminId });

    const conversationIds = conversations.map((conv) => conv._id);

    const unseenMessageCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: adminId },
      seen: false,
    });

    res.status(200).json({ unseenMessageCount });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy số lượng messages chưa đọc", error });
  }
};
// Lấy  những tin nhắn chưa được xem dựa trên userId
const getUnseenMessageCountClient = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({ userId });

    const conversationIds = conversations.map((conv) => conv._id);

    const unseenMessageCount = await Message.countDocuments({
      conversationId: { $in: conversationIds },
      senderId: { $ne: userId },
      seen: false,
    });

    res.status(200).json({ unseenMessageCount });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy số lượng messages chưa đọc", error });
  }
};
// cập nhật tin nhắn chưa xem thành xem rồi bằng conversationId
const updateMessagesToSeen = async (req, res) => {
  try {
    const { conversationId , userId} = req.params;
    
    // Cập nhật tất cả messages có conversationId và seen là false thành true
    const updatedMessages = await Message.updateMany(
      { conversationId: conversationId, seen: false, senderId: { $ne: userId } },
      { $set: { seen: true } }
    );

   return res.status(200).json({
      message: "Đã cập nhật trạng thái seen thành true cho các messages",
      updatedCount: updatedMessages.modifiedCount,
    });
  } catch (error) {
   return res.status(500).json({ message: "Lỗi khi cập nhật trạng thái seen", error });
  }
};
// Xóa tất cả
const deleteAll = async (req, res) =>{
  try {
    await Message.deleteMany({})
    await Conversation.deleteMany({})
  //   await bill.deleteMany({})
  // await billCombo.deleteMany({})
  // await billDish.deleteMany({})
  // await billDetail.deleteMany({})
  res.json({message: 'successfull'})
  } catch (error) {
    
  }

}
export {
    CreateMessager ,
    getMessagesByConversationId,
    getConversationWithMessagesByUserId,
    deleteAll,
    getUnseenMessageCountAdmin,
    getUnseenMessageCountClient,
    updateMessagesToSeen,
    };
