import { ObjectId } from "mongodb";
import db from "../../../DB/ConnectionDB.js";

//================================================================

const addCar = async (req, res, next) => {
  const { name, model } = req.body;
  if (!name || !model) {
    return res.status(404).json({ msg: "name and model are required" });
  }
  const data = await db
    .collection("car")
    .insertOne({ name, model, status: "available" });
  res.status(201).json({ msg: "done", data });
};
//================================================================

const getCars = async (req, res, next) => {
  const data = await db.collection("car").find().toArray();
  res.status(200).json({ msg: "done", data });
};
//================================================================
const getSpecificCar = async (req, res, next) => {
  const { id } = req.params;
  const data = await db.collection("car").findOne({ _id: new ObjectId(id) });
  res.status(200).json({ msg: "done", data });
};

//================================================================
const getCarWithName = async (req, res, next) => {
  console.log(req.query);
  try {
    // Convert 'name' query parameter to an array and trim whitespace/newlines
    let names = Array.isArray(req.query.name)
      ? req.query.name
      : [req.query.name];
    names = names.map((name) => name.trim());

    const data = await db
      .collection("car")
      .find({ name: { $in: names } })
      .toArray();
    res.status(200).json({ msg: "done", data });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ msg: "Internal server error", err });
  }
};

//================================================================
const getAvailableCarsByName = async (req, res, next) => {
  try {
    // Convert 'name' query parameter to an array and trim whitespace/newlines
    let NAME = Array.isArray(req.query.name)
      ? req.query.name
      : [req.query.name];
    NAME = NAME.map((name) => name.trim());

    const data = await db
      .collection("car")
      .find({ name: { $in: NAME }, status: "available" })
      .toArray();
    res.status(200).json({ msg: "done", data });
  } catch (err) {
    console.error("Error fetching cars:", err);
    res.status(500).json({ msg: "Internal server error", err });
  }
};

//================================================================
const getCarsByStatusOrName = async (req, res, next) => {
  try {
    // Get the model from the query parameter and trim whitespace
    const NAME = req.query.name ? req.query.name.trim() : null;
    // Find cars that are either rented or match the specified NAME
    const data = await db
      .collection("car")
      .find({
        $or: [{ status: "rented" }, { name: NAME }],
      })
      .toArray();

    res.status(200).json({ msg: "done", data });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", err });
  }
};

//================================================================
const getAvailableOrRentedCarsByName = async (req, res, next) => {
  try {
    // Extract query parameters and trim whitespace
    const Name = Array.isArray(req.query.name)
      ? req.query.name
      : [req.query.name];
    const trimmedName = Name.map((name) => name.trim());

    // Ensure the query parameter is provided
    if (trimmedName.length === 0 || !trimmedName[0]) {
      return res.status(400).json({ msg: "Model query parameter is required" });
    }

    // Build the query to find available cars of specific Name or rented cars of any specific model
    const query = {
      $or: [
        { name: { $in: trimmedName }, status: "available" },
        { name: { $in: trimmedName }, status: "rented" },
      ],
    };

    // Query the database
    const data = await db.collection("car").find(query).toArray();

    res.status(200).json({ msg: "done", data });
  } catch (err) {
    console.error("Error fetching available or rented cars by model:", err);
    res.status(500).json({ msg: "Internal server error", err });
  }
};
//================================================================

const updateCar = async (req, res, next) => {
  const { id } = req.params;
  const { name, model, status } = req.body;
  if (status != "available" && status != "rented") {
    return res.status(404).json({ msg: "invalid status" });
  }
  const data = await db
    .collection("car")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name, model, status } });
  res.status(200).json({ msg: "done", data });
};

//================================================================
const deleteCar = async (req, res, next) => {
  const { id } = req.params;
  const data = await db.collection("car").deleteOne({ _id: new ObjectId(id) });
  res.status(200).json({ msg: "done", data });
};

//================================================================

//================================================================
export {
  addCar,
  updateCar,
  deleteCar,
  getCars,
  getSpecificCar,
  getCarWithName,
  getAvailableCarsByName,
  getCarsByStatusOrName,
  getAvailableOrRentedCarsByName,
};
