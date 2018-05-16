<template>
  <div>
<b-container>
    <b-row>
        <b-col>
          <b-form @submit="postGeoinformations">
              <b-form-group id="title"
                            label="Geoinformation"
                            label-for="TitleInput">
                <b-form-input id="TitleInput"
                              type="text"
                              v-model="form.title"
                              placeholder="title">
                </b-form-input>
              </b-form-group>

              <b-form-group>
                <b-form-textarea id="info"
                           v-model="form.text"
                           placeholder="information"
                           :rows="2">
                </b-form-textarea>
              </b-form-group>

              <b-form-group>
                <b-form-textarea id="detail"
                           v-model="form.detail"
                           placeholder="detail"
                           :rows="4">
                </b-form-textarea>
              </b-form-group>

              <b-form-group>
                <b-form-textarea id="synonyms"
                           v-model="form.synonyms"
                           placeholder="synonyms"
                           :rows="3">
                </b-form-textarea>
              </b-form-group>

              <b-form-group id="exampleGroup4">
                <b-form-checkbox-group>
                  <b-button type="submit" variant="primary">Submit</b-button>

                </b-form-checkbox-group>
              </b-form-group>
            </b-form>
        </b-col>
          <b-col>
            <b-form @submit="postGroupinformations">
              <b-form-group id="group"
                            label="Groups"
                            label-for="GroupInput">
              <b-form-select 
                id="GroupInput"
                v-model="selectedgeoinformation" 
                class="mb-3">
                  <option :value = event.id
                          v-for = "event of events">
                        {{ event.title }}
                  </option>
              </b-form-select>
            </b-form-group>

              <b-form-group label="Groups">
                <b-form-checkbox-group 
                  stacked
                  id = "groupCheckboxes" 
                  name = "geogroups" 
                  v-model = "selectedgroups">
                    <b-form-checkbox 
                      v-for = "group of groups"
                      :value = group.id>
                        {{ group.title }}
                    </b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
              <b-form-group id="exampleGroup4">
                <b-form-checkbox-group>
                  <b-button type="submit" variant="primary">Submit</b-button>

                </b-form-checkbox-group>
              </b-form-group>
              </b-form>
          </b-col>
          </b-row>
</b-container>

  



    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>

    <table class="table">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">title</th>
      <th scope="col">info</th>
      <th scope="col">detail</th>
      <th scope="col">synonyms</th>
    </tr>
  </thead>
  <tbody>

    <tr v-for="event of events">
      <th scope="row">{{ event.id }}</th>
      <th>{{ event.title }}</th>
      <th>{{ event.shortinformation }}</th>
      <th>{{ event.detailinformation }}</th>
      <th>{{ event.synonyms }}</th>
    </tr>
  </tbody>
</table>

</div>

</template>

<script>
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

export default {
  name: 'geoinformations',

  mounted() {
  },
  created() {
    this.getGeoinformations();
    this.getGeogroups()
  },
  data () {
    return {
      events: [],
      groups: [],
      selectedgroups: [],
      geogroupsREC: [],
      selectedgeoinformation: null,
      errors: [],
      form: {
        title: null,
        info: null,
        detail: null,
        synonyms: null,
      },
    }
  },
  watch: { 
    'selectedgeoinformation': function() { 
      this.getGroupsForGeoinformation()
      console.log("watch");
    //put your addThing code here, as you now have the thing variable set. 
  } },


  methods: {
    getGeoinformations() {
      let url = 'http://localhost:8080/api/geoinformations/';
      axios.get(url)
        .then((response) => {
          this.events = response.data;
          console.log(this.events);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    getGeogroups() {
      let url = 'http://localhost:8080/api/geogroups/';
      axios.get(url)
        .then((response) => {
          this.groups = response.data;
          console.log(this.groups);
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    postGeoinformations() {
      axios.post('http://localhost:8080/api/geoinformations', {
        title: this.form.title,
        shortinformation: this.form.info, 
        detailinformation: this.form.detail, 
        synonyms: this.form.synonyms, 
        created: new Date().toISOString().split('.')[0]+"Z", 
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
    postGroupinformations() {
      axios.post('http://localhost:8080/api/geoinformations', {
        title: this.form.title,
        shortinformation: this.form.info, 
        detailinformation: this.form.detail, 
        synonyms: this.form.synonyms, 
        created: new Date().toISOString().split('.')[0]+"Z", 
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

    copyGroupInfos() {
      var selected = this.selectedgroups;
      this.geogroupsREC.forEach(function (group) {
        console.log("added");
        console.log(group.id);
        //console.log(this.selectedgroups);
        selected.push(group.id)
      });
      console.log(selected);
      this.selectedgroups = selected;
    },

    getGroupsForGeoinformation() {
      this.selectedgroups = [];
      this.geogroupsREC = [];

      let url = 'http://localhost:8080/api/geoinformations/';
      url += this.selectedgeoinformation;
      url += '/groups';
      axios.get(url)
        .then((response) => {
          console.log('axios log: ', response);
          this.geogroupsREC = response.data;
          this.copyGroupInfos();

        })
        .catch((e) => {
          this.errors.push(e);
        });

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
