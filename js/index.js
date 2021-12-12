import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.22/vue.esm-browser.min.js';


const path = "jason";


// https://vue3-course-api.hexschool.io/v2/api/jason/products
const url = `https://vue3-course-api.hexschool.io/v2/api/${path}/products`;

createApp({
    data() {
        return {
            loginData: {
                "username": "",
                "password": "",
            },
            error: {
                message: "",
                detailMessage: "",
                isError: false,
                target: "#exampleModal2"

            },
            success: {
                message: "",
                detailMessage: "",
                isSuccess: false,
                target: "#exampleModal"
            }

        }
    },
    methods: {
        login() {
            const config = {
                ...this.loginData
            }
            axios.post("https://vue3-course-api.hexschool.io/v2/admin/signin", config).then((res) => {
                document.cookie = `userToken=${res.data.token}; expires=${new Date(res.data.expired)} `
                console.log(res);
                if (res.data.message) {
                    this.success.message = res.data.message;
                    this.success.isSuccess = true;

                    setTimeout(() => {
                        this.successModal()
                    }, 0);

                    setTimeout(() => {
                        location.href = "./admin.html"
                    }, 1000);
                }

            }).catch((err) => {
                console.log(this.falseModal);
                this.error.message = err.response.data.message;
                this.error.detailMessage = err.response.data.error.message;
                this.error.isError = true;

                setTimeout(() => {
                    this.falseModal()
                }, 0);
                setTimeout(() => {
                    location.reload();
                }, 2000);
                console.dir(err);
            });


        },
        successModal() {
            new bootstrap.Modal(document.querySelector(this.success.target)).show();

        },
        falseModal() {
            console.log(document.querySelector(this.error.target));
            new bootstrap.Modal(document.querySelector(this.error.target)).show();
        }

    }




}).mount("#app");