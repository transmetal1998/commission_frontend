<template>
    <div class="flex justify-center py-10 text-[#E0E3E8]">
        <Toast/>
        <div class="grid w-[369px] mt-10 max-w-[400px] h-[485.62px] gap-[32px]">



            <div class="grid gap-4">
                <div class="flex flex-col place-items-center text-center gap-2 h-[145.62px]">
                    <div>
                        <Image :src="imageSrc" alt="Image" width="180" />
                    </div>
                    <div class="text-white">
                        <span class="text-4xl font-bold" v-if="is_forgot_sent">Check your email</span>
                        <span class="text-4xl font-bold" v-else>Forgot Password?</span>
                    </div>
                    
                    <div class="flex flex-col" v-if="is_forgot_sent">
                        <div>
                            <span>We sent a password reset link to</span>
                        </div>
                        <div>
                            <span><label for="" class="font-bold">{{ this.loginForm.email }}</label></span>
                        </div>
                        <div class="mt-3">
                            <span>Bear in mind, it will only be valid for 60 minutes.</span>
                        </div>
                    </div>
                    <div class="flex flex-col" v-else>
                        <div>
                            <span>No worries, we'll send you a password reset link.</span>
                        </div>
                    </div>
                </div>
                <div v-if="show_error_panel" class="w-full">
                    <Panel>
                        <template #header>
                            <div>
                                <span class="pi pi-exclamation-triangle" style="color: #DD1E1E"></span>
                                Forgot Password Error
                            </div>
                        </template>
                        <p class="ml-6">
                            {{ login_response_error }}
                        </p>
                    </Panel>
                </div>
                <div v-if="is_forgot_sent" class="flex flex-col place-items-start mt-16 gap-7 h-[308px] my-4">
                    <div class="flex flex-col gap-3 w-full">
                        <div>
                            <Button type="submit" class="w-full" icon="pi pi-arrow-left" @click="redirectToLoginPage()" severity="secondary" label="Back to login" :loading="is_loading"/>                            
                        </div>
                        <div class="flex gap-2 justify-center mt-4">
                            <div>
                                <span>Didn't receive the email?</span>
                            </div>
                            <div>
                                <Message severity="success" variant="simple" class="cursor-pointer" @click="is_forgot_sent = false"><span class="font-bold">Click to resend</span></Message>
                            </div>
                        </div>
                    </div>  
                </div>
                <div v-else class="flex flex-col place-items-start gap-7 h-[308px] my-4">
                    <div class="w-full">
                        <div>
                            <label for="">Email</label>
                            <InputText name="email" v-model="loginForm.email" type="text" placeholder="Enter your email" fluid />
                            <p class="text-[#FC3468] text-sm font-[600] mt-2" v-if="error_message?.email">
                                <ul v-if="error_message.email.length">
                                    <li v-for="(error, index) in error_message.email" :key="index" class="text-red-500">
                                        <span class="pi pi-exclamation-circle"></span> {{ error }}
                                    </li>
                                </ul>
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3 w-full">
                        <div>
                            <Button type="submit" class="w-full" @click="onFormSubmit()" severity="primary" label="Send Link" :loading="is_loading"/>
                        </div>
                        <div>
                            <Button type="submit" class="w-full" icon="pi pi-arrow-left" @click="redirectToLoginPage()" severity="secondary" label="Back to login"/>
                        </div>
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

NewUserLogin
export default {
    components: [
    ],
    data() {
        return {
            loginForm: {
                email: '',
                password: ''
            },
            reset_password: {
                token: null,
                email: '',
                password: '',
                confirm_password: ''
            },
            visible: false,
            is_forgot_sent: false,
            is_reset_sent: false,
            login_response_error: null,
            error_message: {},
            show_error_panel: false,
            is_for_reset_password: false,
            invalid_token: false,
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            profile: 'getProfile',
            is_loading: 'isLoading'
        }),
    },
    mounted() {

        const token = this.$route.params.token;
        if (token) { 

            this.reset_password.token = token;
            this.processVerifyToken();

            this.is_for_reset_password = true; 
            this.reset_password.token = token;
        }

    },
    methods: {
        ...mapActions(useAuthStore, {
            postResetPassword: 'resetPassword',
            postForgotPassword: 'forgotPassword',
            postResetPassword: 'resetPassword',
            postVerifyToken: 'verifyToken',
            setLoading: 'setLoading'
        }),
        async onFormSubmit() {

            this.setLoading(true);
            this.clearErrorResponse();                

            await this.postForgotPassword({
                email: this.loginForm.email,
                password: this.loginForm.password
            }).then((response) => {

                if(response.http_status !== 200) {

                    this.setLoading(false);
                    this.error_message.email = response?.errors?.email || [];
                    this.is_there_errors = response?.errors;

                    if(!this.is_there_errors) {
                        this.show_error_panel = true;
                        this.login_response_error = response?.message;
                    }

                    return false;
                }

                this.clearErrorResponse();
                this.setLoading(false);
                this.is_forgot_sent = true;
                
            })

        },
        clearErrorResponse() {
            this.show_error_panel = false;
            this.login_response_error = null;
            this.error_message = [];  
            this.show_error_panel = false; 
        },
        clearForm() {
            this.loginForm.email = '';
            this.loginForm.password = '';
        },
        redirectToLoginPage() {
            this.$router.push('/login');
        }
    }
};
</script>