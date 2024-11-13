import express from "express";
const router = express.Router();
import {
    CreateConversation,
    getConversationsByAdminId
} from '../controllers/conversation.controller.js'

router.get("/conversation/:adminId", getConversationsByAdminId);
router.post("/conversation", CreateConversation);

export default router;