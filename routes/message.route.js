import express from "express";
const router = express.Router();
import {
     CreateMessager, 
     getMessagesByConversationId,
     getConversationWithMessagesByUserId,
     deleteAll,
     getUnseenMessageCountAdmin,
     getUnseenMessageCountClient,
     updateMessagesToSeen
} from '../controllers/Message.controller.js'


router.get("/message/v2/:conversationId", getMessagesByConversationId);
router.get("/message/text/seen/:userId/client", getUnseenMessageCountClient);
router.get("/message/text/seen/:adminId/admin", getUnseenMessageCountAdmin);
router.put("/message/text/seen/:conversationId/:userId", updateMessagesToSeen);
router.get("/message/:userId", getConversationWithMessagesByUserId);
router.post("/message", CreateMessager);
router.delete("/message", deleteAll);

export default router;