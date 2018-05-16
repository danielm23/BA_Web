<template>
  <div>
    <b-card-group deck>
      <div class="col-sm-3 p-1" v-for="schedule of schedules">
        <b-card   :key="schedule.id"
                  :title="schedule.name"
                  img-src="https://lorempixel.com/600/300/food/5/"
                  img-alt="Image"
                  img-top
                  tag="article"
                  class="m-2">

          <p class="card-text">{{ schedule.info }}</p>
          <router-link :to="{name: 'agenda', params: {scheduleId: schedule.id}}" exact>
            <b-button variant="primary">edit</b-button>
          </router-link>
        </b-card>
        </div>

        <div class="col-sm-3">
          <b-btn v-b-modal.newSchedule>add schedule</b-btn>
        </div>
      </b-card-group>
    

    <b-modal  id="newSchedule"
              ref="newSchedule"  
              hide-footer 
              title="New Schedule">
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

        <b-form-group id="dates"
                      label="Start and End"
                      label-for="DatesInput">
          <el-date-picker
            id="DatesInput"
            v-model="dates"
            type="daterange"
            range-separator="-">
          </el-date-picker>
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
      schedules: [],
      name: '',
      info: '',
      dates: '',
      startDate: '',
      endDate: '',
      isPublic: true,
      version: 1,
      errors: [],
    };
  },
  created() {
    this.getPosts();
  },
  methods: {
    postPost() {
      console.log(this.dates)
      axios.post('http://localhost:8080/api/schedules', {
        name: this.name,
        info: this.info,
        startDate: this.dates[0].toISOString().split('.')[0]+"Z", 
        endDate: this.dates[1].toISOString().split('.')[0]+"Z", 
        isPublic: this.isPublic,
        version: this.version,
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.name = '';
          this.info = '';
          this.getPosts();
          this.hideModal();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getPosts() {
      axios.get('http://localhost:8080/api/schedules')
        .then((response) => {
          // JSON responses are automatically parsed.
          this.schedules = response.data;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    hideModal () {
      this.$refs.newSchedule.hide()
  },
  },
};
</script>