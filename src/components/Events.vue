<template>
  <div>
    <b-card-group deck>
      <div class="col-sm-3 p-1" v-for="event of events">
        <b-card   :key="event.id"
                  :title="event.name"
                  img-src="https://lorempixel.com/600/300/food/5/"
                  img-alt="Image"
                  img-top
                  tag="article"
                  class="m-2">
          <p>{{ event.startDate }} bis {{ event.endDate }}</p>   
          <!--<router-link :to="{name: 'agenda', params: {scheduleId: schedule.id}}" exact>-->
            <b-button variant="primary">edit</b-button>
          </router-link>
        </b-card>
      </div>
      <div class="col-sm-3">
          <b-btn v-b-modal.newEvent>add event</b-btn>
        </div>
    </b-card-group>

    <b-modal  id="newEvent"
              ref="newEvent"  
              hide-footer 
              title="New Event">
      <form @submit.stop.prevent="postPost()">
        <b-form-group id="name"
                      label="Name"
                      label-for="NameInput">
          <b-form-input id="NameInput"
                        type="text"
                        v-model="name"
                        placeholder="Title of the Event-Series">
          </b-form-input>
        </b-form-group>

        <b-form-group id="info"
                      label="Info"
                      label-for="InfoInput">
          <b-form-textarea id="InfoInput"
                        type="text"
                        v-model="info"
                        placeholder="Describe your schedule"
                        :rows="3">
          </b-form-textarea>
        </b-form-group>

        <b-form-group id="date"
                      label="Date"
                      label-for="DateInput">
          <el-date-picker
              id="DateInput"
              v-model="date"
              type="date">
            </el-date-picker>
        </b-form-group>

        <b-form-group id="time"
                      label="Start and end time"
                      label-for="TimeInput">
          <el-time-picker
              id="TimeInput"
              is-range
              v-model="time"
              range-separator="-"
              :picker-options="{
                format: 'HH:mm',
                start: '09:00', 
                end: '10:00'
              }">
          </el-time-picker>
        </b-form-group>

        <b-form-group id="venue"
                      label="Venue"
                      label-for="VenueInput">
          <b-form-select v-model="venueId" id="VenueInput">
            <option v-for="venue of venues" v-bind:value="venue.id">
              {{venue.name}}
              </option>
          </b-form-select>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </form>
    </b-modal>
    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>
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
          this.hideModal();
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
    hideModal () {
      this.$refs.newEvent.hide()
    },
  },
};
</script>