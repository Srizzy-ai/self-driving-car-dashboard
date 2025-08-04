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

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #000000;
  color: #ffffff;
  line-height: 1.6;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
}

h2 {
  margin-bottom: 20px;
  font-size: 1.25rem;
  font-weight: 500;
  color: #ffffff;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 4px;
  font-weight: 500;
}

.loading {
  background-color: #1a1a1a;
  border: 1px solid #333333;
  color: #cccccc;
}

.error {
  background-color: #2d1b1b;
  border: 1px solid #5a3a3a;
  color: #ff6b6b;
}

.section {
  background-color: #111111;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 24px;
  margin-bottom: 24px;
}

.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.car-card {
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 16px;
  border-left: 4px solid #666666;
}

.car-card.driving {
  border-left-color: #4ade80;
}

.car-card.charging {
  border-left-color: #60a5fa;
}

.car-card.idle {
  border-left-color: #fbbf24;
}

.car-card h3 {
  margin-bottom: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.car-card p {
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #cccccc;
}

.car-card strong {
  color: #ffffff;
  font-weight: 500;
}

button {
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #e5e5e5;
}

.update-info {
  text-align: center;
  margin-top: 24px;
  padding: 12px;
  background-color: #111111;
  border: 1px solid #333333;
  border-radius: 4px;
}

.update-info p {
  font-size: 0.9rem;
  color: #cccccc;
  margin: 0;
}
</style>