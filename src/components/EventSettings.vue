<template>
  <div>
	<h4>Event Settings</h4>
	<b-tabs>
	  <b-tab title="Venues" active>
	    	<!-- TAB 1 -->
			<div class="col-sm-3 p-1">
				<b-list-group>
					<b-list-group-item v-for="venue of venues" :key="venue.id">
				  		{{venue.name}}
					</b-list-group-item>
					<b-list-group-item active v-b-modal.newVenue>
						Add venue
					</b-list-group-item>
				</b-list-group>

				<b-modal  id="newVenue"
				              ref="newVenue"  
				              hide-footer 
				              title="New Venue">

					<form @submit.stop.prevent="postVenues()">
						<b-form-group id="name"
						              label="Name"
						              label-for="NameInput">
							<b-form-input id="NameInput"
							            type="text"
							            v-model="venueName"
							            placeholder="Title of the Event-Venue">
							</b-form-input>
						</b-form-group>

						<b-form-group id="geoinformation"
	                      label="Place"
	                      label-for="GeoInput">
				          <b-form-select 	v-model="geoinformationId" 
				          					id="GeoInput">
				            <option v-for="geoinformation of geoinformations" 
				            		v-bind:value="geoinformation.id">
				              {{geoinformation.title}}
				              </option>
				          </b-form-select>
				        </b-form-group>
						<b-button type="submit" variant="primary">Submit</b-button>
					</form>
				</b-modal>
			</div>
	  </b-tab>

	  <b-tab title="Categories" >
	   	<!-- TAB 1 -->
			<div class="col-sm-3 p-1">
				<b-list-group>
					<b-list-group-item 
						v-for="category of categories" 
						:key="category.id">
				  			{{category.name}}
				  		<b-badge 	variant="primary" 
				  					pill
				  					v-bind:style="{'background-color': '#' + category.color}">
				  			#{{category.color}}
				  		</b-badge>
					</b-list-group-item>

					<b-list-group-item active v-b-modal.newCategory>
						Add category
					</b-list-group-item>
				</b-list-group>

				<b-modal  id="newCategory"
				              ref="newCategory"  
				              hide-footer 
				              title="New Category">

					<form @submit.stop.prevent="postCategories()">
						<b-form-group id="categoryName"
						              label="Name"
						              label-for="NameInput">
							<b-form-input id="NameInput"
							            type="text"
							            v-model="categoryName"
							            placeholder="Title of the Event-Category">
							</b-form-input>
						</b-form-group>

						<b-form-group 	id="categoryColor"
	                      				label="Color"
	                      				label-for="ColorInput">
				          <!--<b-form-input 	v-model="categoryColor" 
				          					id="ColorInput"
				          					placeholder="Color(Hex)">
				          </b-form-input>-->
				          <el-color-picker 	v-model="categoryColor"
				          					id="ColorInput">					
				          </el-color-picker>
				        </b-form-group>
						
						<b-button type="submit" variant="primary">Submit</b-button>
					</form>
				</b-modal>
			</div>
	  </b-tab>

	  <b-tab title="General Settings">
	    <div id="qr_code">
	            <p>With this code the schedule can be shared.
	            </p>
	            <img :src="qrLink"/>
	          </div>
	  </b-tab>
	</b-tabs>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    this.generateQrCode();
  },
  data() {
    return {
      venues: [],
      categories: [],
      geoinformations: [],
      geoinformationId: '',
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
    this.getGeoinformations()
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
    getGeoinformations() {
      let url = 'http://localhost:8080/api/geoinformations/';
      axios.get(url)
        .then((response) => {
          this.geoinformations = response.data;
        })
        .catch((e) => {
          this.eventerrors.push(e);
        });
    },
    postVenues() {
      axios.post('http://localhost:8080/api/venues', {
        name: this.venueName,
        scheduleId: this.$route.params.scheduleId,
        geoinformationId: this.geoinformationId,
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.venueName = '';
          this.getVenues();
          this.hideVenueModal();
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },
    postCategories() {
      axios.post('http://localhost:8080/api/tags', {
        name: this.categoryName,
        color: parseInt(this.categoryColor.substr(1), 16),
        scheduleId: this.$route.params.scheduleId,
      })
        .then((response) => {
          console.log('axios log: ', response);
          this.categoryName = '';
          this.categoryColor = '';
          this.getCategories();
          this.hideCategoryModal();
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
    hideVenueModal () {
      this.$refs.newVenue.hide()
    },
    hideCategoryModal () {
      this.$refs.newCategory.hide()
    },
  },
};
</script>