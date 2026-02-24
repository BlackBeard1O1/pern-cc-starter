import express from "express";
import { cars } from "./schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

//logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

//get all cars route
router.get("/cars", async(req, res) => {
  const allCars = await db.select().from(cars);

  res.json(allCars);
});

//create a new car route
router.post("/cars", async (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({
      error: "Please provide make, model, year, and price",
    });
  }

  const nextId = cars.length + 1;

const [newCar] = await db.insert(cars).values({ make, model, year, price }).returning();

  res.status(201).json(newCar);
});

//update na car route
router.put("/cars/:id", async (req, res) => {
  const carId = parseInt(req.params.id);
  const carDetails = req.body;

  const existingCar = await db.select().from(cars).where(eq(cars.id, carId));

  if (!existingCar == null) {
    return res.status(404).json({ error: "Car not found" });
  }

  const updatedCar = await db.update(cars).set(carDetails).where(eq(cars.id, carId)).returning();

  res.json(updatedCar);
});

//delete a car route
router.delete("/cars/:id", async (req, res) => {
  const carId = parseInt(req.params.id);
  
  const deleted = await db
    .delete(cars)
    .where(eq(cars.id, carId))
    .returning();

  if (deleted.length === 0) {
    return res.status(404).json({ error: "Car not found" });
  }
    res.json(deleted);
});

router.get("/cars/:id", async (req, res) => {
  const carId = parseInt(req.params.id);
  
  const car = await db.select().from(cars).where(eq(cars.id, carId));

  if (car.length === 0) {
    return res.status(404).json({ error: "Car not found" });
  }

  res.json(car[0]);
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
