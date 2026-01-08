<template>
    <div class="flex justify-center p-10 text-[#000000]">
        <Toast/>
        <div class="grid w-[369px] mt-10 max-w-[400px] h-[485.62px] gap-[32px]" style="border: 1px solid transparent; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);">
            <div class="grid gap-1">
                <div class="flex flex-col place-items-center gap-3 h-[145.62px]">
                    <div>
                        <!-- <Image :src="imageSrc" alt="Image" width="180" /> -->
                    </div>
                    <div class="flex flex-col place-items-center">
                        <center>
                        <span class="text-4xl font-bold text-[#b6142c]">Management Information System</span>
                        </center>
                    </div>
                    <div>
                        <span>First DataCorp</span>
                    </div>
                </div>
                <div class="flex flex-col place-items-start h-[308px] my-4">
                    <div class="w-full">
                        <Form class="grid">
                            <div v-if="show_login_response_error" class="w-full mb-9">
                                <Panel>
                                    <template #header>
                                        <div>
                                            <span class="pi pi-exclamation-triangle" style="color: #DD1E1E"></span>
                                            {{ this.login_response_error.message_title }}
                                        </div>
                                    </template>
                                    <p class="ml-6">
                                        {{ this.login_response_error.message }}
                                    </p>
                                </Panel>
                            </div>
                            <div class="mb-9">
                                <label for="" class="">Email</label>
                                <InputText name="email" v-model="loginForm.username" type="text" placeholder="Enter your email" fluid />
                                <p class="text-[#FC3468] text-sm font-[600] mt-2" v-if="error_message?.email">
                                    <ul v-if="error_message.email.length">
                                        <li v-for="(error, index) in error_message.email" :key="index">
                                            <span class="pi pi-exclamation-circle"></span> {{ error }}
                                        </li>
                                    </ul>
                                </p>
                            </div>
                            <div class="mb-2">
                                <label for="" class="">Password</label>
                                <Password name="password" v-model="loginForm.password" placeholder="Enter your password" :feedback="false" toggleMask fluid />
                                <p class="text-[#FC3468] text-sm font-[600] mt-2" v-if="error_message?.password">
                                    <span class="pi pi-exclamation-circle"></span>
                                    {{ error_message?.password }}
                                </p>
                            </div>                                
                            <div class="mb-9">
                                <label for="forgot_password" class="cursor-pointer text-sm text-[#b6142c] font-bold" @click="redirectToForgotPasswordPage()">Forgot Password</label>
                            </div>
                            <div class="">
                                <Button type="submit" class="w-full" @click="onFormSubmit()" severity="primary" label="Sign In" :loading="is_loading"/>
                            </div>
                        </Form>
                        <NewUserLogin v-model:visible="visible" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '@/stores/auth/authStore';
import NewUserLogin from '@/components/partials/NewUserLogin.vue';

export default {
    components: [
        NewUserLogin
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