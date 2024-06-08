import { ObjectId } from "mongodb";
import db from "../../../DB/ConnectionDB.js";

//================================================================

const signup = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const exist = await db.collection("customer").findOne({ email });
  if (exist) {
    return res.status(404).json({ msg: "email is found" });
  }
  const customer = { name, email, password, phone };
  const data = await db.collection("customer").insertOne(customer);
  res.status(200).json({ msg: "done", data });
};
//================================================================
const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const exist = await db.collection("customer").findOne({ email });
    if (!exist || password !== exist.password) {
      return res.status(404).json({ msg: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful", exist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//================================================================
const getCustomer = async (req, res, next) => {
  const data = await db.collection("customer").find().toArray();
  res.status(200).json({ msg: "done", data });
};
//================================================================
const getSpecificCustomer = async (req, res, next) => {
  const { id } = req.params;
  const data = await db
    .collection("customer")
    .findOne({ _id: new ObjectId(id) });
  res.status(200).json({ msg: "done", data });
};
//================================================================

const updateCustomer = async (req, res, next) => {
  const { id } = req.params;
  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid ID format" });
  }

  const { userId } = req.body; // Assuming userId is passed in the request body
  // Convert id and userId to ObjectId for comparison
  const objectId = new ObjectId(id);
  const userObjectId = new ObjectId(userId);

  // Ensure the user is the owner
  if (!objectId.equals(userObjectId)) {
    return res
      .status(403)
      .json({ msg: "You are not authorized to delete this customer" });
  }
  try {
    const { name, phone } = req.body;
    const data = await db
      .collection("customer")
      .updateOne({ _id: new ObjectId(id) }, { $set: { name, phone } });
    data.modifiedCount
      ? res.status(200).json({ msg: "customer updated", data })
      : res.status(400).json({ msg: "fail to update", data });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", err });
  }
};

//================================================================

const deleteCustomer = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body; // Assuming userId is passed in the request body

  // Validate the ID format
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid ID format" });
  }

  // Convert id and userId to ObjectId for comparison
  const objectId = new ObjectId(id);
  const userObjectId = new ObjectId(userId);

  // Ensure the user is the owner
  if (!objectId.equals(userObjectId)) {
    return res
      .status(403)
      .json({ msg: "You are not authorized to delete this customer" });
  }

  try {
    const data = await db.collection("customer").deleteOne({ _id: objectId });
    if (data.deletedCount) {
      res.status(200).json({ msg: "Customer deleted successfully", data });
    } else {
      res.status(404).json({ msg: "Customer not found", data });
    }
  } catch (err) {
    res.status(500).json({ msg: "Internal server error", err });
  }
};

export {
  signup,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  signIn,
  getSpecificCustomer,
};
