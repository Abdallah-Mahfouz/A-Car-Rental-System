import { Router } from "express";
import {
  addCar,
  deleteCar,
  getAvailableCarsByName,
  getAvailableOrRentedCarsByName,
  getCarWithName,
  getCars,
  getCarsByStatusOrName,
  getSpecificCar,
  updateCar,
} from "./Car.controllers.js";

const router = Router();

router.get("/", getCars);
router.get("/available-Cars-ByName", getAvailableCarsByName);
router.get("/Cars-ByStatus-Or-Name", getCarsByStatusOrName);
router.get("/availableOrRented-Cars-ByName", getAvailableOrRentedCarsByName);
router.get("/getCarWithName", getCarWithName);
router.get("/:id", getSpecificCar);
router.post("/", addCar);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;
