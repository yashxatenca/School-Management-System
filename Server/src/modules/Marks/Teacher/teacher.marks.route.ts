import { Router } from "express";
import { MarksController } from "./teacher.marks.controller";
import { GlobalAuthMiddleware } from "../../../middleware/Gloabal.auth.middleware";

const router = Router();
router.use(GlobalAuthMiddleware(["teacher"]));
// Create a new mark entry
router.post("/", MarksController.createMark);

// Get marks based on query filters (e.g., ?studentId=123 OR ?examId=456&classId=789)
router.get("/", MarksController.getMarks);

// Get a specific mark entry by its ID
router.get("/:id", MarksController.getMarkById);

// Update a mark entry
router.put("/:id", MarksController.updateMark);

// Delete a mark entry
router.delete("/:id", MarksController.deleteMark);

export default router;
