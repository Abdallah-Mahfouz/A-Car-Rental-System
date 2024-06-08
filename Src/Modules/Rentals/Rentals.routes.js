import { Router } from "express";
import { addRent, deleteRent, getAllRent, getSpecificRent, updateRent } from "./Rentals.controllers.js";

const router = Router();

router.get("/", getAllRent);
router.get("/:id", getSpecificRent);
router.post("/", addRent);
router.put("/:id", updateRent);
router.delete("/:id", deleteRent);

export default router;
