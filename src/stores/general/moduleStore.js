import { defineStore } from 'pinia';
import { api } from '@/boot/axios';

export const useModuleStore = defineStore('moduleStore', {
    state: () => ({
      /**
       * REMARKS!!!
       * 
       * modules.id: If there are no child items, manually set the corresponding ID from the common permission API response.
       * If there are child items, copy the ID of the first child item.
       * 
       * modules.items.id: Manually set the corresponding ID from the common permission API response.
       * modules.items.parent_id: The parent ID must be set; otherwise, it will result in a 403 Access Denied error.
       * 
       */
        modules: [
            {
              id: 0,
              label: "Dashboard",
              icon: "pi pi-home",
              route: "/dashboard",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              path: 'general/DashboardPage.vue',
              items: null,
            },
            {
              id: 2,
              label: "User Management",
              icon: "pi pi-users",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              path: null,
              items: [
                {
                  id: 2,
                  label: "Manage Users",
                  route: "/user-management",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'administrator/user-management/UserManagementPage.vue',
                  parent_id: 2,
                },
                {
                  id: 1,
                  label: "Roles and Permission",
                  route: "/user-roles-privileges",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'administrator/user-roles-privileges/UserRolesPrivilegesPage.vue',
                  parent_id: 2,
                },
                {
                  id: 3,
                  label: "Activity Logs",
                  route: "/activity-logs",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: true,
                  path: 'administrator/activity-log/ActivityLogPage.vue',
                  parent_id: 2,
                },
              ],
            },
            {
              id: 4, 
              label: "Order Monitoring",
              icon: "pi pi-shopping-cart",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              items: [
                {
                  id: 4,
                  label: "Active Orders",
                  route: "/active-orders",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'order-monitoring/ActiveOrders.vue',
                  parent_id: 4,
                },
                {
                  id: 4,
                  label: "Order History",
                  route: "/order-history",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'order-monitoring/OrderHistory.vue',
                  parent_id: 4,
                },
              ]
            },
            {
              id: 3,
              label: "Order Taking",
              icon: "pi pi-tags",
              route: "/order-taking",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              items: null,
              path: 'customer-order-taking/OrderTakingPage.vue',
            },
            {
              id: 5,
              label: "Product Management",
              icon: "pi pi-box",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              items: [
                {
                  id: 5,
                  label: "Product",
                  route: "/product",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'product-management/Product.vue',
                  parent_id: 5
                },
                {
                  id: 5,
                  label: "Bundles",
                  route: "/product-bundles",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'product-management/Bundles.vue',
                  parent_id: 5
                },
                {
                  id: 6,
                  label: "Product Listing",
                  route: "/product-listing",
                  permission: 1,
                  type: 'child',
                  active: true,
                  is_for_system_admin_only: false,
                  path: 'product-management/ProductListing.vue',
                  parent_id: 5
                },
              ]
            },
            {
              id: 6,
              label: "Statistics",
              icon: "pi pi-chart-bar",
              route: "/statistics",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              items: null,
              path: 'statistics/Statistics.vue',
            },
            {
              id: 6,
              label: "Reports",
              icon: "pi pi-file",
              route: "/reports",
              permission: 1,
              type: 'parent',
              active: false,
              is_for_system_admin_only: false,
              items: null,
              path: 'reports/Reports.vue',
            },
            {
              id: 7,
              label: "Settings",
              icon: "pi pi-cog",
              route: "/settings",
              permission: 1,
              type: 'parent',
              active: false,
              is_for_system_admin_only: false,
              items: null,
              path: 'settings/Settings.vue',
            },
            {
              id: 8,
              label: "Store Management",
              icon: "pi pi-shop",
              route: "/support",
              permission: 1,
              type: 'parent',
              active: true,
              is_for_system_admin_only: false,
              items: null,
              path: 'store-management/StoreManagementPage.vue',
            },
          ],
        user_modules: [],
        is_system_admin: false,
        active: {
          parent: null,
          child: null
        },
        is_module_loading: false,
    }),
    getters: {
        getModules (state) {
            return state.modules;
        },
        getUserModules (state) {
          return state.user_modules;
        },
        isSystemAdminModule (state) {
          return state.is_system_admin;
        },
        getActiveMenu (state) {
          return state.active;
        },
        isModuleLoading (state) {
          return state.is_module_loading;
        }
    },
    actions: {
      setSystemAdminModule(value) {
          this.is_system_admin = value
      },
      setModuleLoading(value) {
        this.is_module_loading = value
      },
      userModulePermission(items, permissions) {
        
        const filteredModules = items
            .filter(item => 
              item.active && // filter the active modules
              (this.is_system_admin || !item.is_for_system_admin_only) // Show only system admin items if user is admin
            )
            .map(item => {

              if (item.id === 0) { // Include the dashboard always
                return { ...item, permission: true };
              }

              // find matching permission object with the item.id
              const permissionObj = permissions.find(p => p.id === item.id);
              const hasPermission = permissionObj ? permissionObj.permissions.includes(item.permission) : false;

              let childHasPermission = false;

              // If the item has child modules, check if any child has permission
              if (item.items) {
                const childPermissions = this.permissionForSubModule(item.items, permissions);
                childHasPermission = childPermissions.length > 0;
              }

              // If the parent has permission or at least one child has permission, set permission to true
              const finalPermission = hasPermission || childHasPermission;

              return {
                ...item,
                permission: finalPermission,
                items: item.items ? this.permissionForSubModule(item.items, permissions) : undefined
              };
            })
            .filter(item => item.permission); //filter only the permission true

            // Store the filtered modules in state
            this.user_modules = filteredModules;

            // Store in the session the simplified access
            const simplifiedModules = filteredModules.flatMap(({ id, label, type, items }) => {
              const parentData = { module_id: id, label, type };
              const childData = items ? items.map(({ id, label, type }) => ({ module_id: id, label, type })) : [];
              return [parentData, ...childData];
            });
            sessionStorage.setItem('access_permission', JSON.stringify(simplifiedModules));
  
      },
      permissionForSubModule(items, permissions) {
      
        return items
        .filter(item => 
          item.active &&
          (this.is_system_admin || !item.is_for_system_admin_only)
        )
        .map(item => {

          const permissionObj = permissions.find(p => p.id === item.id);
          const hasPermission = permissionObj ? permissionObj.permissions.includes(item.permission) : false;

          return {
            ...item,
            permission: hasPermission,
          };
        })
        .filter(item => item.permission);

      },
      setActiveMenu(label, type) {
        if (type == 'parent') {
          sessionStorage.setItem('activeParent', label);  
          this.active.parent = label;
        } else {
          sessionStorage.setItem('activeChild', label);
          this.active.child = label;
        }      
      },
      fetchActiveMenu() {
        this.active.parent = sessionStorage.getItem("activeParent") || null;
        this.active.child = sessionStorage.getItem("activeChild") || null;
      },
      checkPermission(action_id, module_id, module_type) {

        /**
         * action_id : 1 (access/ visiting routes)
         *  2 (add)
         *  3 (edit/ modify)
         *  4 (delete)
         * 
         * module_id : specific module id from the routes 
         * (Parent ID if no child or Child ID if specific route)
         * 
         * module_type : 'Parent' or 'Child' used in the checking of action_id if 1 (access checking)
         */

        const user_data = sessionStorage.getItem('user');
        const permission = JSON.parse(user_data);  
        const user_permission = permission.role.permissions

        if(action_id === 1){
          // For checking of permission routes if action is for 'access'
          const access_permission = JSON.parse(sessionStorage.getItem('access_permission') || '[]');
          const hasPermission = access_permission.some(module => module.module_id === module_id && module.type === module_type);
          return hasPermission
        }

        const hasPermission = user_permission.some(module => 
          module.id === module_id && module.permissions.includes(action_id)
        );

        return hasPermission;

      }
    }
});
