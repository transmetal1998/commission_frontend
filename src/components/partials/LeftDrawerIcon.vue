  <template>
    <div class="sidebar-container h-full max-h-screen overscroll">
      <div class="p-1">
        <div class="py-1 mb-1">
          <span class="justify-center items-center flex">
            <Avatar label="CS" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" />
            <!-- <img :src="CSLogo" alt="Commission System Logo" class="logo-img" /> -->
          </span>
        </div>
      </div>
      <div class="card w-full">
        <div class="card flex justify-center">
          <PanelMenu :model="items" class="w-full md:w-80">
            <template #item="{ item }">
              <router-link
                v-if="item.route"
                v-slot="{ href, navigate, isActive }"
                :to="item.route"
                custom
              >
                <a
                  v-ripple
                  @click="navigate"
                  :href="href"
                  :class="[
                    'flex items-center cursor-pointer px-4 py-2',
                    isActive ? 'bg-[#3c3c3c] text-white rounded-md' : 'text-surface-700 dark:text-surface-0'
                  ]"
                >
                  <span :class="item.icon" />
                  <span class="ml-2">{{ item.label }}</span>
                </a>
              </router-link>

              <a
                v-else
                v-ripple
                class="flex items-center cursor-pointer text-surface-700 dark:text-surface-0 px-4 py-2"
                :href="item.url"
                :target="item.target"
              >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <span v-if="item.items" class="pi pi-angle-down text-primary ml-auto" />
              </a>
            </template>
          </PanelMenu>
        </div>

      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'pinia';
  import { useModuleStore } from '@/stores/general/moduleStore';
  import CSLogo from '@/assets/cs.png';
  
  
  export default {
    data() {
      return {
        CSLogo,
        updatedItems: [],
        active_parent: null,
        active_child: null,
        items: [
                  {
                      label: '',
                      icon: 'pi pi-chart-bar',
                      route: '/dashboard'
                  },

                  {
                      label: '',
                      icon: 'pi pi-server',
                      route: '/canvasCost'
                  },
                   {
                      label: '',
                      icon: 'pi pi-user',
                      items: [
                         {
                              label: '',
                              icon: 'pi pi-chart-scatter',
                              route: '/salesparameter/hurdle'
                          },
                          {
                              label: '',
                              icon: 'pi pi-percentage',
                              route: '/salesparameter/salescommission'
                          },
                          {
                              label: '',
                              icon: 'pi pi-chart-bar',
                              route: '/salesparameter/salesquota'
                          }
                        ]
                  },
                  {
                      label: '',
                      icon: 'pi pi-dollar',
                      route: '/salescore'                          
                  },
                  {
                      label: '',
                      icon: 'pi pi-desktop',
                      items: [
                          {
                              label: '',
                              icon: 'pi pi-chart-bar',
                              route: '/newhireprocess/guidelines'
                          },
                          {
                              label: '',
                              icon: 'pi pi-address-book',
                              route: '/newhireprocess/guidelines'
                          },
                        ]
                  },
                    
                
                  {
                      label: '',
                      icon: 'pi pi-wrench',
                      items: [
                          {
                              label: '',
                              icon: 'pi pi-user ',
                              route: '/settings/usercreation'
                          },
                          {
                              label: '',
                              icon: 'pi pi-file',
                              route: '/settings/usercreation'
                          },  
                          {
                              label: '',
                              icon: 'pi pi-users',
                              route: '/settings/usercreation'
                          },
                      ]
                  },
              ]
      };
    },
    computed: {
      
    },
    beforeMount() {
  
  
  
    },
    methods: {
    
    }
  };
  </script>