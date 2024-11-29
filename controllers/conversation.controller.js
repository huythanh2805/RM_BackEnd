import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js'; // Giả sử model User để tìm các admin

/**
 * Hàm tạo hoặc lấy conversation cho một senderId
 * @param {String} senderId - ID của người gửi tin nhắn
 * @param {String} text - Nội dung tin nhắn đầu tiên
 * @returns {Object} - Đối tượng conversation và message
 */
const CreateConversation = async (req, res) => {
  const  {senderId} = req.body
  try {
   
    // Tìm kiếm cuộc trò chuyện đã tồn tại với người dùng
    let conversation = await Conversation.findOne({ userId: senderId });

    // Nếu không tồn tại, tạo một conversation mới
    if (!conversation) {
      // Nếu người gửi có role là Admin thì tạo 1 conversation với người nhận chính là người đó
      const user = await User.findById(senderId)
      if (user.role === "ADMIN") {
        conversation = await Conversation.create({
          userId: senderId,
          adminIds: [senderId],
        })
      }else{
        // Tìm tất cả các admin
        const admins = await User.find({ role: "ADMIN" })
        const adminIds = admins.map((admin) => admin._id.toString())

        // Tạo mới conversation với danh sách adminIds
        conversation = await Conversation.create({
          userId: senderId,
          adminIds,
        })
      }
    }

    return res.status(201).json({ message: "Tạo thành công", conversationId: conversation._id });
  } catch (error) {
    console.error('Error in createOrGetConversation:', error);
    throw new Error('Failed to create or get conversation');
  }
};
/**
 * Hàm lấy tất cả các conversation dựa trên id của admin
 * @param {String} adminId - ID của admin
 * @returns {Array} - Danh sách các conversation với thông tin message gần đây nhất
 */
const getConversationsByAdminId = async (req, res) => {
  const { adminId } = req.params;
  console.log(adminId)
  try {
    // Tìm tất cả các conversation mà adminId có trong mảng adminIds
     const conversations = await Conversation.find({
      $or: [
        { adminIds: adminId },
        { userId: adminId }
      ]
    });
    // Lấy ID của các conversation
    const conversationIds = conversations.map((conv) => conv._id);

    // Tìm tin nhắn gần đây nhất của mỗi conversation và sắp xếp chúng
    const recentConversations = await Conversation.aggregate([
      { $match: { _id: { $in: conversationIds } } },
      {
        $lookup: {
          from: 'messages',
          localField: '_id',
          foreignField: 'conversationId',
          as: 'messages',
        },
      },
      {
        $addFields: {
          // Lấy tin nhắn cuối cùng từ messages mà không cần lọc theo senderId
          lastMessage: { 
            $cond: {
              if: { $gt: [{ $size: "$messages" }, 0] },
              then: { $arrayElemAt: ["$messages", -1] },
              else: null
            }
          }
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      {
        $unwind: '$userId', // Biến userId từ array thành object
      },
      {
        $project: {
          userId: 1,                  // Giữ lại userId
          adminIds: 1,                // Giữ lại adminIds
          lastMessage: {
            _id: 1,
            conversationId: 1,
            senderId: 1,
            text: 1,
            seen: 1,
            createdAt: 1,            // Đảm bảo giữ lại createdAt trong lastMessage
          },
        },
      },
      { 
        $sort: { 'lastMessage.createdAt': -1 } // Sắp xếp theo createdAt của tin nhắn gần đây nhất 
      }
    ]);
    return res.status(201).json({recentConversations});
  } catch (error) {
    console.error('Error in getConversationsByAdminId:', error);
    // throw new Error('Failed to get conversations');
  }
};
export {
  CreateConversation,
  getConversationsByAdminId
}