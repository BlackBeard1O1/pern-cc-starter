import express from 'express';

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);

    next();
});

let cars = [
    { id: 1, make: 'Toyota', model: 'Camry', year: 2020 },
    { id: 2, make: 'Honda', model: 'Civic', year: 2019 },
    { id: 3, make: 'Ford', model: 'Mustang', year: 2021 },
];

router.get('/', (req, res) => {
    res.json(cars);
});

router.get("/:id", (req, res) => {

    const carId = parseInt(req.params.id);
    const car = cars.find(c => c.id === carId);

    if(!car) return res.status(404).json({ error: 'Car not found' });
    
    res.json(car);

});

router.post('/', (req, res) => {
    const id = cars.length + 1;
    const { make, model, year } = req.body;
    const newCar = { id, make, model, year };
    cars.push(newCar);
    res.send(newCar);
});

router.put('/:id', (req, res) => {
    const carId = parseInt(req.params.id);
    const carIndex = cars.findIndex(c => c.id === carId);

    if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
    }

    const { make, model, year } = req.body;
    cars[carIndex] = { ...cars[carIndex], make, model, year };
    res.json(cars[carIndex]);
});

router.delete('/:id', (req, res) => {
    const carId = parseInt(req.params.id);
    const carIndex = cars.findIndex(c => c.id === carId);

    if (carIndex === -1) {
        return res.status(404).json({ error: 'Car not found' });
    }

    cars.splice(carIndex, 1);
    res.json({ message: 'Car deleted successfully' });
});


app.use('/api/v1/car', router);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});