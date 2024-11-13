import express from "express";
const router = express.Router();
import {
     CreateMessager, 
     getMessagesByConversationId,
     getConversationWithMessagesByUserId,
     deleteAll
} from '../controllers/Message.controller.js'


router.get("/message/:userId", getConversationWithMessagesByUserId);
router.get("/message/v2/:conversationId", getMessagesByConversationId);
router.post("/message", CreateMessager);
router.delete("/message", deleteAll);

export default router;