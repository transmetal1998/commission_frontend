<template>

<ConfirmDialog>
    <template #container>
        <div class="flex flex-col place-items-center gap-4" style="width: 400px; height: 228px; max-width: 400px; border-radius: 12px; padding: 1.5rem;">
            <div class="font-bold">
                <Message severity="error" variant="simple" icon="pi pi-exclamation-triangle"><span class="font-bold">Reset Link Expired</span></Message>
            </div>
            <div>
                <p>The password reset link you used has expired or is invalid. Please request a new link by clicking the 'Forgot Password' option.</p>
            </div>
            <div class="grid w-full">
                <Button severity="primary" label="Continue" @click="redirectToLoginPage()" :loading="is_loading"></Button>
            </div>
        </div>
    </template>
</ConfirmDialog>

    <div class="flex justify-center py-10 text-[#E0E3E8]">
        <Toast/>
        <div class="grid w-[369px] mt-10 max-w-[400px] h-[485.62px] gap-[32px]">

            <div class="grid gap-4">
                <div class="flex flex-col place-items-center text-center gap-2 h-[145.62px]">
                    <div>
                        <Image :src="imageSrc" alt="Image" width="180" />
                    </div>
                    <div class="text-white mt-3">
                        <div>
                            <span class="text-4xl font-bold" v-if="is_reset_sent">Password Reset</span>
                            <span class="text-4xl font-bold" v-else>Set new password</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-col" v-if="is_reset_sent">
                        <div>
                            <span>Your password has been successfully reset. Click below to log in once again</span>
                        </div>
                    </div>
                    <div class="flex flex-col" v-else>
                        <div>
                            <span>Your new password must be different <br> to previously used passwords.</span>
                        </div>
                    </div>
                </div>

                <div v-if="is_reset_sent" class="flex flex-col place-items-start mt-16 gap-7 h-[308px] my-4">
                    <div class="flex flex-col gap-3 w-full">
                        <div>
                            <Button type="submit" class="w-full" icon="pi pi-arrow-left" @click="redirectToLoginPage()" severity="secondary" label="Continue" :loading="is_loading"/>                            
                        </div>
                    </div>  
                </div>

                <div v-else class="flex flex-col place-items-start gap-7 h-[308px] my-4">
                    <div class="grid w-full gap-9">
                        <div class="grid gap-9">
                            <div>
                                <label for="" class="">Password</label>
                                <Password name="password" v-model="reset_password.password" placeholder="Enter your password" :feedback="false" toggleMask fluid />
                            </div>
                            <div>
                                <label for="" class="">Confirm Password</label>
                                <Password name="password" v-model="reset_password.password_confirmation" placeholder="Enter your confirm password" :feedback="false" toggleMask fluid />
                            </div>
                        </div>
                        <div class="flex flex-col gap-3 w-full">
                            <p class="text-[#FC3468] text-sm mt-2 font-[600]" v-if="error_message?.password">
                                    <ul v-if="error_message.password.length">
                                        <li v-for="(error, index) in error_message.password" :key="index">
                                            <span class="pi pi-times-circle mr-2"></span>
                                            {{ error }}
                                        </li>
                                    </ul>
                                </p>
                        </div>
                        <div class="flex flex-col gap-3 w-full">
                            <div>
                                <Button type="submit" class="w-full" @click="processResetPassword()" severity="primary" label="Reset Password" :loading="is_loading"/>
                            </div>
                            <div>
                                <Button type="submit" class="w-full" icon="pi pi-arrow-left" @click="redirectToLoginPage()" severity="secondary" label="Back to login"/>
                            </div>
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
import { ConfirmDialog } from 'primevue';

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
                password_confirmation: ''
            },
            is_reset_sent: false,
            login_response_error: null,
            error_message: {},
            show_error_panel: false,
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            profile: 'getProfile',
            is_loading: 'isLoading'
        }),
    },
    mounted() {

        const token = this.$route.query.token;
        const email = this.$route.query.email;
    
        if (token && email) { 

            this.reset_password.token = token;
            this.reset_password.email = email;
            this.processVerifyToken();

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
        async processResetPassword () {

            this.setLoading(true);
            this.clearErrorResponse();


            await this.postResetPassword({
                email: this.reset_password.email,
                password: this.reset_password.password,
                password_confirmation: this.reset_password.password_confirmation,
                token: this.reset_password.token
            }).then((response) => {

                if(response.http_status !== 200) {

                    this.setLoading(false);
                    this.error_message.password = response?.errors?.password || [];
                    this.is_there_errors = response?.errors;

                    if(!this.is_there_errors) {
                        this.show_error_panel = true;
                        this.login_response_error = response?.message;
                    }

                    return false;
                }

                this.clearErrorResponse();
                this.setLoading(false);
                this.is_reset_sent = true;
                
            })

        },
        async processVerifyToken() {

            await this.postVerifyToken({
                email: this.reset_password.email,
                token: this.reset_password.token
            }).then((response) => {

                if(response.http_status !== 200) {
                    this.expiredTokenDialog();
                    return false;
                }

                this.clearErrorResponse();
                return true;
                
            })

        },
        expiredTokenDialog() {
            this.$confirm.require({
                accept: () => {
                    this.$toast.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
                },
            });
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
        },
    }
};
</script>