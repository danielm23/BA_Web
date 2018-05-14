<template>
  <div>
  <div class="grid-container">
    <div class="grid-x grid-padding-x small-up-2 medium-up-3">
      <div v-for="event of events" class="cell"">
        <div class="card">
          <div class="card-divider">
            <h4>{{event.name}}</h4>
          </div>
          <img src="" alt="image">
          <div class="card-section">
            <p>{{ event.startDate }} bis {{ event.endDate }}</p>
          </div>
        </div>
      </div>
      <div class="cell">
        <a data-open="eventForm">
          <i class="icon-plus large-icon"></i>
        </a>
        <div class="reveal" id="eventForm" data-reveal>
          <h1>New Event</h1>
        <form @submit.prevent="postPost()" method="post">
          <label>Name
            <input type="text" v-model="name" />
          </label>
          <label>Info
            <textarea rows="4" v-model="info"></textarea>
          </label>
          <label>Datum
            <el-date-picker
              v-model="date"
              type="date">
            </el-date-picker>
          </label>
          <label>Zeit
            <el-time-picker
              is-range
              v-model="time"
              range-separator="-"
              :picker-options="{
                format: 'HH:mm',
                start: '09:00', 
                end: '10:00'
              }">
            </el-time-picker>
          </label>
          </label>
          <label>Ort
            <select v-if="venues && venues.length" v-model="venueId">
              <option v-for="venue of venues" v-bind:value="venue.id">
              {{venue.name}}
              </option>
            </select>
          </label>
          <button class="success button" type="submit" name="button">Submit</button>
         </form>
          <button class="close-button" data-close aria-label="Close modal" type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="grid-x">
      <div class="medium-6 large-4 cell">
        <ul v-if="errors && errors.length">
          <li v-for="error of errors">
            {{error.message}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      venues: [],
      errors: [],
      eventerrors: [],
      name: '',
      info: '',
      date: '',
      time: [new Date(2018, 1, 1, 9), new Date(2018, 1, 1, 10)],
      venueId: '',
      scheduleId: '',
      value1: '',
      isActive: true,
      startDate: '',
      endDate: '',
    };
  },

  // Fetches posts when the component is created.
  created() {
    this.getPosts();
    this.getVenues();
  },
  methods: {
    getPosts() {
      const schedule = this.$route.params.scheduleId;
      let url = 'http://localhost:8080/api/schedules/';
      url += schedule;
      url += '/events';
      axios.get(url)
        .then((response) => {
          this.events = response.data;
        })
        .catch((e) => {
          this.eventerrors.push(e);
        });
    },
    postPost() {
      console.log(this.time[0].toISOString());

      axios.post('http://localhost:8080/api/events', {
        name: this.name,
        info: this.info, 
        startDate: this.time[0].toISOString().split('.')[0]+"Z", 
        endDate: this.time[1].toISOString().split('.')[0]+"Z", 
        isActive: this.isActive, 
        scheduleId: this.$route.params.scheduleId,
        venueId: parseInt(this.venueId, 10),
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.name = '';
          this.info = '';
          this.startDate = '';
          this.endDate = '';
          this.startDate = '';
          this.venueId = '';
          this.getPosts();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getVenues() {
      const schedule = this.$route.params.scheduleId;
      let url = 'http://localhost:8080/api/schedules/';
      url += schedule;
      url += '/venues';
      axios.get(url)
        .then((response) => {
          this.venues = response.data;
        })
        .catch((e) => {
          this.eventerrors.push(e);
        });
    },
  },
};
</script>