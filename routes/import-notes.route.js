import express from "express";
import ImportNotesController from "../controllers/import-notes.controller.js";

const router = express.Router();

const importNotesController = new ImportNotesController();

router.get("/import-notes", importNotesController.fetchListImportNotes);
router.delete("/import-notes/:id", importNotesController.deleteImportNotes);
router.post("/import-notes/create", importNotesController.createImportNotes);
router.get("/import-notes/:id", importNotesController.getDetailImportNotes);
router.put("/import-notes/:id", importNotesController.updateImportNotes);

export default router;
