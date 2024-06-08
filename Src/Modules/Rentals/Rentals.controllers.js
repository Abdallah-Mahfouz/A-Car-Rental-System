import { ObjectId } from "mongodb";
import db from "../../../DB/ConnectionDB.js";

//================================================================

const addRent = async (req, res, next) => {
  const { carId, customerId, rentDate, returnDate } = req.body;
  const customerExist = await db
    .collection("customer")
    .findOne({ _id: new ObjectId(customerId) });
  if (!customerExist) {
    return res.status(404).json({ msg: "Customer not found" });
  }
  // Check if the car exists

  const carExist = await db
    .collection("car")
    .findOne({ _id: new ObjectId(carId), status: "available" });
  if (!carExist) {
    return res.status(404).json({ msg: "car not found and not available" });
  }

  if (new Date(returnDate) < new Date(rentDate)) {
    return res
      .status(404)
      .json({ msg: "returnDate must be greater than rentDate" });
  }

  const data = await db.collection("Rental").insertOne({
    carId: new ObjectId(carId),
    customerExist: new ObjectId(customerId),
    rentDate: rentDate,
    returnDate: returnDate,
  });

  await db
    .collection("car")
    .updateOne({ _id: new ObjectId(carId) }, { $set: { status: "rented" } });
  return res.status(200).json({ msg: "done", data });
};
//================================================================

const getAllRent = async (req, res, next) => {
  const data = await db.collection("Rental").find().toArray();
  res.status(200).json({ msg: "done", data });
};
//================================================================

const getSpecificRent = async (req, res, next) => {
  const { id } = req.params;
  const data = await db.collection("Rental").findOne({ _id: new ObjectId(id) })
  res.status(200).json({ msg: "done", data });
};
//================================================================

const updateRent = async (req, res, next) => {
  const { id } = req.params;
  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid ID format" });
  }
  const { rentDate, returnDate } = req.body;
  const data = await db
    .collection("Rental")
    .updateOne({ _id: new ObjectId(id) }, { $set: { rentDate, returnDate } });
  res.status(200).json({ msg: "done", data });
};

//================================================================
const deleteRent = async (req, res, next) => {
  const { id } = req.params;

   // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid ID format" });
  }

  try {
    const data = await db
      .collection("Rental")
      .findOneAndDelete({ _id: new ObjectId(id) });

      // Check if the rental was found and deleted
    if (!data) {
      return res.status(404).json({ msg: "Rental not found" });
    }

    await db
      .collection("car")
      .updateOne(
        { _id: new ObjectId(data.carId) },
        { $set: { status: "available" } }
      );
    return res.status(200).json({ msg: "done", data });
  } catch (err) {
    return res.status(500).json({ msg: "Internal server error", err });
  }
};

//================================================================

export { addRent, deleteRent, updateRent, getAllRent ,getSpecificRent};
