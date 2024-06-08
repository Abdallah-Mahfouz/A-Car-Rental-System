import { Router } from "express";
import {
  deleteCustomer,
  getCustomer,
  getSpecificCustomer,
  signIn,
  signup,
  updateCustomer,
} from "./Customer.controllers.js";

const router = Router();

router.get("/", getCustomer);
router.get("/:id", getSpecificCustomer);
router.post("/", signup);
router.post("/signIn", signIn);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
