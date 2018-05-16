<template>
  <div>
  	<h3>{{ schedule.name }}</h3>
  	<p>{{ schedule.info }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      schedule: '',
      errors: [],
    };
  },
  created() {
    this.getSchedule();
  },
  methods: {
    getSchedule() {
      const schedule = this.$route.params.scheduleId;
      let url = 'http://localhost:8080/api/schedules/';
      url += schedule;
      axios.get(url)
        .then((response) => {
          this.schedule = response.data;
        })
        .catch((e) => {
          this.eventerrors.push(e);
        });
    },
  },
};
</script>