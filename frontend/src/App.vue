<template>
  <div id="app">
    <h1>🚗 Self-Driving Car Monitoring Dashboard</h1>
    
    <div v-if="loading" class="loading">
      📡 Loading car data...
    </div>
    
    <div v-if="error" class="error">
      ❌ Error: {{ error }}
    </div>
    
    <div v-if="!loading && !error">
      
      <div class="section">
        <h2>🗺️ Live Car Locations</h2>
        <div id="map" style="height: 400px; width: 100%; border: 2px solid #ddd; border-radius: 8px;"></div>
      </div>
      
      <div class="section">
        <h2>📊 Car Status</h2>
        <div class="car-grid">
          <div 
            v-for="car in cars" 
            :key="car.id" 
            class="car-card"
            :class="{ 
              driving: car.status === 'driving',
              charging: car.status === 'charging',
              idle: car.status === 'idle'
            }"
          >
            <h3>Car #{{ car.id }}</h3>
            <p><strong>Brand:</strong> {{ car.brand }}</p>
            <p><strong>Speed:</strong> {{ car.speed.toFixed(1) }} mph</p>
            <p><strong>Battery:</strong> {{ car.battery.toFixed(1) }}%</p>
            <p><strong>Status:</strong> {{ car.status }}</p>
            <p><strong>Location:</strong> {{ car.lat.toFixed(4) }}, {{ car.lon.toFixed(4) }}</p>
            <p><strong>Task:</strong> {{ car.currentTask }}</p>
            <button @click="viewDetails(car)">View Details</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="update-info">
      <p>🔄 Auto-updating every 3 seconds | Last update: {{ lastUpdateTime }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import L from 'leaflet'

export default {
  name: 'App',
  data() {
    return {
      cars: [],
      loading: true,
      error: null,
      lastUpdateTime: null,
      map: null,
      markers: {}
    }
  },
  async mounted() {
    await this.fetchCars()
    this.initMap()
    setInterval(this.fetchCars, 3000)
  },
  methods: {
    async fetchCars() {
      try {
        this.loading = true
        this.error = null
        
        const response = await axios.get('http://localhost:3000/api/vehicles')
        this.cars = response.data.data
        this.lastUpdateTime = new Date().toLocaleTimeString()
        
        this.updateMapMarkers()
        
      } catch (error) {
        this.error = 'Failed to fetch car data. Make sure backend is running.'
        console.error('Error fetching cars:', error)
      } finally {
        this.loading = false
      }
    },
    
    initMap() {
      this.map = L.map('map').setView([37.7749, -122.4194], 13)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)
      
      this.updateMapMarkers()
    },
    
    updateMapMarkers() {
      if (!this.map) return
      
      Object.values(this.markers).forEach(marker => {
        this.map.removeLayer(marker);
      });
      this.markers = {};
      
      this.cars.forEach(car => {
        let markerColor = '#808080'
        if (car.status === 'driving') markerColor = '#4caf50'
        else if (car.status === 'charging') markerColor = '#2196f3'
        else if (car.status === 'idle') markerColor = '#ff9800'
        
        const marker = L.circleMarker([car.lat, car.lon], {
          radius: 8,
          fillColor: markerColor,
          color: '#000',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map)
        
        marker.bindPopup(`
          <strong>Car #${car.id}</strong><br>
          ${car.brand}<br>
          Speed: ${car.speed.toFixed(1)} mph<br>
          Battery: ${car.battery.toFixed(1)}%<br>
          Status: ${car.status}
        `)
        
        this.markers[car.id] = marker
      })
    },
    
    viewDetails(car) {
      alert(`Car ${car.id} Details:\nLocation: ${car.lat}, ${car.lon}\nTask: ${car.currentTask}`)
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString()
    }
  }
}
</script>

<style>
@import 'leaflet/dist/leaflet.css';

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #000000;
}

#app {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5em;
  color: #000000;
}

h2 {
  margin-bottom: 15px;
  font-size: 1.5em;
  color: #000000;
}

.loading, .error {
  text-align: center;
  font-size: 1.2em;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  color: #000000;
}

.loading {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.error {
  background-color: #ffebee;
  border: 2px solid #f44336;
}

.section {
  background: white;
  padding: 20px;
  margin-bottom: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.car-card {
  background: #ffffff;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  border-left: 6px solid #ccc;
}

.car-card.driving {
  border-left-color: #4caf50;
  background-color: #f1f8e9;
}

.car-card.charging {
  border-left-color: #2196f3;
  background-color: #e3f2fd;
}

.car-card.idle {
  border-left-color: #ff9800;
  background-color: #fff3e0;
}

.car-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  font-weight: bold;
  color: #000000;
}

.car-card p {
  margin: 4px 0;
  font-size: 0.9em;
  line-height: 1.3;
  color: #000000;
}

.car-card strong {
  font-weight: bold;
  color: #000000;
}

button {
  background-color: #2196f3;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 15px;
  font-size: 1em;
  font-weight: bold;
  width: 100%;
}

button:hover {
  background-color: #1976d2;
}

.update-info {
  text-align: center;
  margin-top: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.update-info p {
  font-size: 1em;
  margin: 0;
  font-weight: bold;
  color: #000000;
}
</style>