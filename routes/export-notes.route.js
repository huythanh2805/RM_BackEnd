import express from "express";
import ExportNotesController from "../controllers/export-notes.controller.js";

const router = express.Router();

const exportNotesController = new ExportNotesController();

router.get("/export-notes", exportNotesController.fetchListExportNotes);
router.delete("/export-notes/:id", exportNotesController.deleteExportNotes);
router.post("/export-notes/create", exportNotesController.createExportNotes);
router.get("/export-notes/:id", exportNotesController.getDetailExportNotes);
router.put("/export-notes/:id", exportNotesController.updateExportNotes);

export default router;
