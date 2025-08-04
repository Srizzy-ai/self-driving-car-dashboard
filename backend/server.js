const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let cars = [
  {
    id: 1,
    brand: "Tesla Model S",
    speed: 42,
    battery: 78,
    status: "driving",
    lat: 37.7749,
    lon: -122.4194,
    currentTask: "Delivering food order",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    brand: "Mercedes EQS",
    speed: 0,
    battery: 89,
    status: "charging",
    lat: 37.7849,
    lon: -122.4094,
    currentTask: "Charging at mall",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    brand: "Audi e-tron",
    speed: 28,
    battery: 63,
    status: "driving",
    lat: 37.7649,
    lon: -122.4294,
    currentTask: "Transporting passenger",
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    brand: "BMW 7 Series",
    speed: 0,
    battery: 41,
    status: "idle",
    lat: 37.7549,
    lon: -122.4394,
    currentTask: "Waiting at parking lot",
    lastUpdated: new Date().toISOString()
  }
];

function updateCars() {
  for (let i = 0; i < cars.length; i++) {
    let car = cars[i];
    
    if (car.status === 'driving') {
      car.lat = car.lat + (Math.random() - 0.5) * 0.001;
      car.lon = car.lon + (Math.random() - 0.5) * 0.001;
      
      car.speed = car.speed + (Math.random() - 0.5) * 10;
      if (car.speed < 0) car.speed = 0;
      if (car.speed > 80) car.speed = 80;
      
      car.battery = car.battery - Math.random() * 2;
      if (car.battery < 0) car.battery = 0;
      
      if (car.battery < 20) {
        car.status = 'charging';
        car.speed = 0;
        car.currentTask = 'Low battery - finding charger';
      }
      
    } else if (car.status === 'charging') {
      car.battery = car.battery + Math.random() * 5;
      if (car.battery > 100) car.battery = 100;
      car.speed = 0;
      
      if (car.battery > 95) {
        car.status = 'driving';
        car.currentTask = 'Back on the road';
      }
      
    } else if (car.status === 'idle') {
      if (Math.random() < 0.1) {
        car.status = 'driving';
        car.speed = Math.random() * 40 + 20;
        car.currentTask = 'Got new ride request';
      }
    }
    
    car.lastUpdated = new Date().toISOString();
  }
}

setInterval(updateCars, 2000);

app.get('/api/vehicles', function(req, res) {
  res.json({
    success: true,
    data: cars,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/vehicles/:id', function(req, res) {
  const carId = parseInt(req.params.id);
  let foundCar = null;
  
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].id === carId) {
      foundCar = cars[i];
      break;
    }
  }
  
  if (foundCar) {
    res.json({
      success: true,
      data: foundCar
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Car not found'
    });
  }
});

app.listen(PORT, function() {
  console.log('Car Monitoring API running on http://localhost:' + PORT);
  console.log('Test endpoint: http://localhost:' + PORT + '/api/vehicles');
  console.log('Car simulation started - cars will move every 2 seconds');
});