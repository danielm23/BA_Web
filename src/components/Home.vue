<template>
  <div>
  <div class="grid-container">
    <div class="grid-x grid-padding-x small-up-2 medium-up-3" data-equalizer="card" id="equalizer">
      <div v-for="schedule of schedules" class="cell">
        <div class="card" data-equalizer-watch="card">
          <div class="card-divider">
            <h4>{{schedule.name}}</h4>
          </div>
          <!--<img src="../assets/img/orbit/01.jpg" alt="image">-->
          <div class="card-section">
            <p>{{ schedule.info }}</p>
            <router-link :to="{name: 'agenda', params: {scheduleId: schedule.id}}" exact>
              <button type="button" class="success button">edit</button>
            </router-link>
          </div>
        </div>
      </div>

      <div class="cell centered-icon">
        <a data-open="scheduleForm">
          <i class="icon-plus "></i>
        </a>
        <div class="reveal" id="scheduleForm" data-reveal>
          <h1>New Schedule</h1>
          <form @submit.prevent="postPost()" method="post">
          <label>Veranstaltung
            <input type="text" v-model="name" />
          </label>
          <label>Info
            <textarea rows="4" v-model="info"></textarea>
          </label>
          <el-date-picker
            v-model="dates"
            type="daterange"
            range-separator="-">
          </el-date-picker>
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
  },
};
</script>