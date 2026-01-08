<template>
    <div class="flex justify-center p-10 text-[#000000]">
        TEST
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';

export default {
    components: [

    ],
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            show_login_response_error: false,
            login_response_error: {},
            error_message: {},
            visible: false,
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            profile: 'getProfile',
            is_loading: 'isLoading',
        }),
    },
    methods: {
        ...mapActions(useAuthStore, {
            postLogin: 'login',
            setLoading: 'setLoading'
        }),
        async onFormSubmit() {

            if( this.loginForm.email === '' || this.loginForm.password === '' ) {
                this.$toast.add({ severity: 'error', summary: 'Login Error', detail: `User Credentials are required.`, life: 1300});
                return;
            }

            this.postLogin(this.loginForm)
            .then((response) => {
                // Login successful
                this.show_login_response_error = false;
                this.login_response_error = {};
                this.error_message = {};

                console.log(response);
                if(response.token) {
                    this.$toast.add({ severity: 'success', summary: 'Login Success', detail: `Welcome back! You've successfully logged in.`, life: 1300});
                    this.$router.push('/dashboard');
                } else {
                    this.$toast.add({ severity: 'error', summary: 'Login Error', detail: 'Invalid Username or Password!', life: 1300});
                    return;
                }

            }).catch((error) => {
                // Login failed
                if (error.response && error.response.status === 422) {
                    // Validation errors
                    this.error_message = error.response.data.errors;
                } else {
                    // Other errors
                    this.show_login_response_error = true;
                    this.login_response_error = {
                        message_title: 'Login Failed',
                        message: error.response && error.response.data && error.response.data.message ? error.response.data.message : 'An unexpected error occurred. Please try again.'
                    };
                }
            });

            // this.$toast.add({ severity: 'success', summary: 'Login Success', detail: `Welcome back! You've successfully logged in.`, life: 3000});
            
           this.setLoading(false);
                

        },
        redirectToForgotPasswordPage() {
            this.$router.push('/forgot-password');
        }
    }
};
</script>