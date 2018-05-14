<template>
  <div class="grid-container">
    <div class="x-grid">
      <h4>Event Settings</h4>
      <ul id="tabs" class="tabs" data-tabs>
        <li class="tabs-title is-active"><a href="#panel1d" aria-selected="true">Venues</a></li>
        <li class="tabs-title"><a href="#panel2d">Categories</a></li>
        <li class="tabs-title"><a href="#panel3d">General Settings</a></li>
      </ul>
      <div class="tabs-content" data-tabs-content="tabs">
        <div class="tabs-panel is-active" id="panel1d">
          <div class="grid-x">
            <div class="small-12 medium-8 large-4 cell">
              <div v-for="venue of venues">
                <div data-closable class="callout alert-callout-subtle">
                  {{venue.name}}
                  <button class="close-button" aria-label="Dismiss alert" type="button" data-close>
                    <span aria-hidden="true">⊗</span>
                  </button>
                </div>
              </div>
              <a data-open="venueForm">
                <i class="icon-plus large-icon"></i>
            </a>
            </div>
          </div>
          <div class="reveal" id="venueForm" data-reveal>
            <form @submit.prevent="postVenues()" method="post">
              <div class="grid-x">
                <div class="medium-12 cell">
                  <h1>New Venue</h1>
                  <label>Name
                    <input type="text" v-model="venueName" />
                  </label>
                  <button class="success button" type="submit" name="button">Submit</button>
                </div>
                <button class="close-button" data-close aria-label="Close modal" type="button">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="tabs-panel" id="panel2d">
          <div class="grid-x">
            <div class="small-12 medium-8 large-4 cell">
              <div v-for="category of categories">
                <div v-bind:style="{'border-color': '#' + category.color}" data-closable class="callout alert-callout-subtle">
                  {{category.name}} (#{{category.color}})
                  <button class="close-button" aria-label="Dismiss alert" type="button" data-close>
                    <span aria-hidden="true">⊗</span>
                  </button>
                </div>
              </div>
              <a data-open="categoryForm">
                <i class="icon-plus large-icon"></i>
            </a>
            </div>
          </div>
          <div class="reveal" id="categoryForm" data-reveal>
            <form @submit.prevent="postCategories()" method="post">
              <div class="grid-x">
                <div class="medium-12 cell">
                  <h1>New Category</h1>
                  <label>Name
                    <input type="text" v-model="categoryName" />
                  </label>
                </div>
              </div>
              <div class="grid-x">
                <div class="large-6 cell">
                  <label>Color (HEX)
                    <input type="text" v-model="categoryColor" />
                  </label>
                </div>
              </div>
              <div class="grid-x">
                <div class="medium-12 cell">
                  <button class="success button" type="submit" name="button">Submit</button>
                </div>
                <button class="close-button" data-close aria-label="Close modal" type="button">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="tabs-panel" id="panel3d">

          <div id="qr_code">
            <p>With this code the schedule can be shared.
            </p>
            <img :src="qrLink"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {

  name: 'tabs',
  mounted() {
    
    this.generateQrCode();
  },
  data() {
    return {
      venues: [],
      categories: [],
      errors: [],
      venueName: '',
      categoryName: '',
      categoryColor: '',
      scheduleId: '',
      qrLink: 'link',
      styleObject: {
        'border-color': 'red',
        fontSize: '13px',
      },
    };
  },

  // Fetches posts when the component is created.
  created() {
    this.getVenues();
    this.getCategories();
  },
  methods: {
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
    getCategories() {
      const schedule = this.$route.params.scheduleId;
      let url = 'http://localhost:8080/api/schedules/';
      url += schedule;
      url += '/tags';
      axios.get(url)
        .then((response) => {
          this.categories = response.data;
          // hex
          for (let i = 0; i < this.categories.length; i += 1) {
            this.categories[i].color = this.categories[i].color.toString(16);
          }
        })
        .catch((e) => {
          this.eventerrors.push(e);
        });
    },
    postVenues() {
      axios.post('http://localhost:8080/api/venues', {
        name: this.venueName,
        scheduleId: this.$route.params.scheduleId,
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.venueName = '';
          this.getVenues();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    postCategories() {
      axios.post('http://localhost:8080/api/tags', {
        name: this.categoryName,
        color: parseInt(this.categoryColor, 16),
        scheduleId: this.$route.params.scheduleId,
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.categoryName = '';
          this.categoryColor = '';
          this.getCategories();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    generateQrCode() {
      // https://developers.google.com/chart/infographics/docs/qr_codes
      const schedule = this.$route.params.scheduleId;
      let qrurl = 'https://chart.googleapis.com/chart?chs=240x240&cht=qr&chld=H&chl=';
      qrurl += schedule;
      qrurl += '&choe=UTF-8';
      this.qrLink = qrurl;
    },
  },
};
</script>