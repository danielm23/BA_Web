<template>
<div class="container">
  <div class="row">
    <div id="map">
    </div>
    
  <div>
    <b-form @submit="postLocation">
      <b-form-group id="adress"
                    label="Adress"
                    label-for="AdressInput">
        <b-form-input id="AdressInput"
                      type="text"
                      v-model="form.adress"
                      placeholder="adress">
        </b-form-input>
      <b-form-group>
      </b-form-group>
        <b-form-input id="zip"
                      type="text"
                      v-model="form.zip"
                      placeholder="zip">
        </b-form-input>
      </b-form-group>
      <b-form-group>
        <b-form-input id="city"
                      type="text"
                      v-model="form.city"
                      placeholder="city">
        </b-form-input>
      </b-form-group>

      <b-form-group>
        <b-form-input id="country"
                      type="text"
                      v-model="form.country"
                      placeholder="country">
        </b-form-input>
      </b-form-group>

      <p>
      longitude: {{ longitude }}
      <br> latitude: {{ latitude }}
    </p>

      <b-form-group id="exampleGroup4">
        <b-form-checkbox-group v-model="form.checked" id="exampleChecks">
          <b-button type="submit" variant="primary">Submit</b-button>

        </b-form-checkbox-group>
      </b-form-group>
      
    </b-form>

  </div>


    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>

    <table class="table">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">longitude</th>
      <th scope="col">latitude</th>
      <th scope="col">adress</th>
    </tr>
  </thead>
  <tbody>

    <tr v-for="event of events">
      <th scope="row">{{ event.id }}</th>
      <th>{{ event.longitude }}</th>
      <th>{{ event.latitude }}</th>
      <th>{{ event.adress }} {{ event.zip }} {{ event.city }}</th>
    </tr>
  </tbody>
</table>
  </div>
</div>

</template>

<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default {
  name: 'geolocations',

  mounted() {
    this.createMap();
  },
  created() {
    this.getLocations();
  },
  data () {
    return {
      longitude: null,
      latitude: null,
      events: [],
      errors: [],
      form: {
        adress: null,
        zip: null,
        city: null,
        country: null,
      },
    }
  },
  methods: {
    getLocations() {
      let url = 'http://localhost:8080/api/geolocations/';
      axios.get(url)
        .then((response) => {
          this.events = response.data;
          console.log(this.events);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    postLocation() {
      axios.post('http://localhost:8080/api/geolocations', {
        adress: this.form.adress,
        zip: this.form.zip, 
        city: this.form.city, 
        country: this.form.country, 
        latitude: this.latitude,
        longitude: this.longitude,
        created: new Date().toISOString().split('.')[0]+"Z", 
        userId: 2
      })
        .then((response) => {
          console.log('axios log: ', response);
          /*this.name = '';
          this.info = '';
          this.startDate = '';
          this.endDate = '';
          this.startDate = '';
          this.venueId = '';
          this.getPosts();*/
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    createMap: function () {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaWVsbXVlbGxlciIsImEiOiJjamV6aWI0cm8wZGlqMzNubmY0Y2Z3dTV3In0.XvpytTUjg0lX_Kh1SLOvqg'
      this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v9',
          center: [8.25, 49.99], // Manhattan
          zoom: 13
      })
      var nav = new mapboxgl.NavigationControl();
      this.map.addControl(nav, 'top-left');

      var geolocate = new mapboxgl.GeolocateControl({
          positionOptions: {
              enableHighAccuracy: true
          },
          trackUserLocation: true
      });
      this.map.addControl(geolocate);
      geolocate.on('geolocate', (e) => {
        console.log(e);
        this.longitude = e.coords.longitude;
        this.latitude = e.coords.latitude;
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#map {
  width: 100%;
  height: 500px;
  position: relative;
}
</style>
