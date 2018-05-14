<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top" id="mainNav">
      <a class="navbar-brand" href="index.html">Start Bootstrap</a>
      <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarResponsive">
        <ul class="navbar-nav navbar-sidenav" id="exampleAccordion">

          <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Dashboard">
            <router-link class="nav-link" :to="{name: 'agenda', params: {scheduleId: $route.params.scheduleId}}" exact>
              <i class="icon-home large-icon"></i>
              <span class="nav-link-text">Overview</span>
            </router-link>
          </li>

          <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Charts">
            <router-link class="nav-link" :to="{name: 'events', params: {scheduleId: $route.params.scheduleId}}" exact>
              <i class="icon-cog large-icon"></i>
              <span class="nav-link-text">Veranstaltungen</span>
            </router-link>
          </li>

           <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Charts">
            <router-link class="nav-link" :to="{name: 'messages', params: {scheduleId: $route.params.scheduleId}}" exact>
              <i class="icon-cog large-icon"></i>
              <span class="nav-link-text">Messages</span>
            </router-link>
          </li>
          
          <li class="nav-item" data-toggle="tooltip" data-placement="right" title="Charts">
            <router-link class="nav-link" :to="{name: 'eventsettings', params: {scheduleId: $route.params.scheduleId}}" exact>
              <i class="icon-cog large-icon"></i>
              <span class="nav-link-text">Settings</span>
            </router-link>
          </li>

        </ul>
      </div>
  </nav>
</template>
