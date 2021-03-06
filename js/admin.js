import {
    createApp
} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.22/vue.esm-browser.min.js';

let d = new bootstrap.Modal(document.querySelector('#productModal'));

let e = new bootstrap.Modal(document.querySelector('#loading'));


createApp({
        data() {
            return {
                modal: '',
                // 分頁專用
                pagination: {

                },
                // 產品資料
                products: [],
                // axios.create
                userRequest: "",

                // 副圖網址
                subProductUrl: '',

                // 新增的資料
                addNewData: {

                    "category": "",
                    "content": "",
                    "description": "",
                    "id": "",
                    "imageUrl": "",
                    "imagesUrl": [],
                    "is_enabled": 0,
                    "num": '',
                    "origin_price": '',
                    "price": '',
                    "title": '',
                    "unit": ''

                },
                errorMessage: {},

                ID: '',


                sysTemLoader: {
                    title: "",
                    message: "",
                    isSuccess: false
                }
            }
        },
        methods: {
            checkLogin() {
                const token = document.cookie.replace(/(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
                axios.defaults.headers.common['Authorization'] = token;
                axios.post("https://vue3-course-api.hexschool.io/v2/api/user/check").then((res) => {

                        console.log(res)
                        return axios.get("https://vue3-course-api.hexschool.io/v2/api/jason/admin/products"); // Promise 鏈接

                    }).catch((err) => {
                        console.dir(err);
                        if (!err.data.success) {
                            alert(err.data.message);
                            location = "index.html"
                        }

                    })
                    .then((res) => { // 驗證登入狀態後取得產品資料
                        console.log(this);
                        console.log(res.data.products);
                        this.pagination = res.data.pagination
                        this.products = res.data.products;

                    })
            },

            showModal(DOM, id) {
                new bootstrap.Modal(document.querySelector(DOM)).show();
                id ? this.ID = id : null
            },
            closeModal(DOM) {
                console.log('closed !!');
                new bootstrap.Modal(document.querySelector(DOM)).hide();
            },
            Axios(method, url, config = "") {
                console.log(url, {
                    data: config
                });
                this.userRequest[method](url, {
                    data: config
                }).then((res) => {
                    console.log(method, res, method, res.config.data);
                    return axios.get("https://vue3-course-api.hexschool.io/v2/api/jason/admin/products"); // Promise 鏈接
                }).catch((err) => {
                    console.dir(err);
                }).then((res) => { // 驗證登入狀態後取得產品資料
                    console.log(res);
                    console.log(res.data.products);
                    this.pagination = res.data.pagination
                    this.products = res.data.products
                })
            },

            deletdData() {
                console.log(this);
                this.products.forEach((element, index) => {
                    console.log(element.id === this.ID);
                    if (element.id === this.ID) {
                        console.log(element.id === this.ID);
                        this.products.splice(index, 1)
                    }

                });
                this.sysTemLoader.title = "刪除結果";
                this.sysTemLoader.message = "成功 !!";
                //  e.show();


                this.Axios('delete', `/api/jason/admin/product/${this.ID}`)

            },
            // //建立新的產品 --> 取消
            resetDataAnderrorMessage() {

                this.addNewData = {}
                this.errorMessage = {}
                this.subProductUrl = ''
            },
            renderErrorMessage(errorMsg) {

                console.log("錯誤訊息", errorMsg);

                Object.keys(errorMsg).forEach((items) => {
                    this.errorMessage[items] = String(errorMsg[items])

                })

                console.log("處理", this.errorMessage);


            },
            // //建立新的產品 --> 確認
            addtDataConfirm(addData) {

                const error = this.formVadidate();
                console.log(error);

                //error is undefined => {}
                this.errorMessage = !error ? {} : error;

                d.hide();
                if (!error) {
                    // 表單驗證沒有錯誤

                    // this.addNewData.imagesUrl = this.subProductUrl.collection;

                    this.products.unshift({
                        ...addData
                    });



                    this.Axios('post', `/api/jason/admin/product`, this.addNewData)

                    // this.addNewData = {}
                    this.errorMessage = {}
                    Object.keys(this.addNewData).forEach((item) => {

                        if (typeof this.addNewData[item] === "object") {
                            this.addNewData[item] = []
                        } else {
                            this.addNewData[item] = ''
                        }

                    })
                    // myModal.hide()
                } else {
                    // 表單驗證有錯誤
                    this.renderErrorMessage(error);
                }



            },
            // // 建立新的產品、編輯產品  -->新增主圖
            addMainImg(url) {
                this.addNewData.imageUrl = url;
            },
            //建立新的產品、編輯產品  --> 移除主圖
            removeMainImg() {
                this.addNewData.imageUrl = '';
            },

            // 建立新的產品、編輯產品  -->新增副圖
            addSubImg(url) {
                console.log(url);
                if (!url) {
                    return;
                }
                this.addNewData.imagesUrl ? this.addNewData.imagesUrl = [...this.addNewData.imagesUrl] : this.addNewData.imagesUrl = [] // 這一行不能刪 ==> 這一行是在解決點擊 增加副圖 之後 在按取消之後發生的 傳參考問題
                this.addNewData.imagesUrl ? this.addNewData.imagesUrl.push(url) : this.addNewData.imagesUrl = []

                this.subProductUrl = "";

            },
            // //建立新的產品 -->選擇副圖-->  移除副圖
            selectSubImage(SubimgUrl) {
                this.subProductUrl = SubimgUrl;
            },
            // //建立新的產品、編輯產品 -->移除副圖
            removeSubImg(subProductUrl) {

                this.addNewData.imagesUrl = [...this.addNewData.imagesUrl] // 這一行不能刪 ==> 這一行是在解決點擊  移除副圖 之後 在按取消之後發生的 傳參考問題
                this.addNewData.imagesUrl.forEach((item, index, arr) => {
                    if (subProductUrl === item) {
                        arr.splice(index, 1)
                        this.subProductUrl = "";

                    }
                })

            },
            // // 點擊編輯 ==> 帶入一筆 items 資料 以及資料處理
            injectData() {
                console.log('aaa');
                let injectedData = this.products.filter((element) => {

                    return element.id === this.ID;

                });

                // 文字的 data
                this.addNewData = {
                    ...injectedData[0],
                    //     imageUrl:''
                };
                console.log(this.addNewData, injectedData);
                console.log(this.addNewData === injectedData[0]);
                // 副圖
                this.subProductUrl = this.addNewData.imagesUrl ? this.addNewData.imagesUrl[0] : '';



                console.log('subProductUrl', this.subProductUrl, );

            },

            confirmEditData(data) {

                const error = this.formVadidate();
                console.log(error);

                //error is undefined => {}
                this.errorMessage = !error ? {} : error;


                if (!error) {
                    // 表單驗證沒有錯誤



                    this.products.forEach((item, index, arr) => {

                        if (item.id === this.ID) {
                            arr.splice(index, data)

                        }

                    })




                    console.log(this.addNewData);

                    this.Axios('put', `/api/jason/admin/product/${this.ID}`, this.addNewData)

                    // var myModal = new bootstrap.Modal(document.getElementById('productModal'), {
                    //     keyboard: false
                    // })
                    this.errorMessage = {}
                    this.addNewData = {}
                    this.subProductUrl = '';
                    // myModal.hide()

                } else {
                    // 表單驗證有錯誤
                    this.renderErrorMessage(error);
                }


            },
            formVadidate() {
                const constraints = {
                    title: {
                        presence: {
                            message: "為必填"
                        },
                        length: {
                            minimum: 4,
                            tooShort: "^ 必須填寫 %{count} 個以上的文字"
                        }
                    },
                    category: {
                        presence: {
                            message: "為必填",
                        },
                        length: {
                            minimum: 4,
                            tooShort: "^ 必須填寫 %{count} 個以上的文字"
                        }
                    },
                    unit: {
                        presence: {
                            message: "為必填"
                        },
                        length: {
                            minimum: 1
                        }
                    },
                    origin_price: {
                        presence: {
                            message: "為必填"
                        },
                        numericality: {
                            greaterThanOrEqualTo: 0,
                            message: "^需要填入大於0的數字 "
                        }
                    },
                    price: {
                        presence: {
                            message: "為必填"
                        },
                        numericality: {
                            greaterThanOrEqualTo: 0,
                            message: "^需要填入大於0的數字 "
                        }
                    }
                }

                return validate({
                    title: this.addNewData.title,
                    category: this.addNewData.category,
                    unit: this.addNewData.unit,
                    origin_price: this.addNewData.origin_price,
                    price: this.addNewData.price,

                }, constraints);
            },
            // 分頁模組 換頁功能
            $emit_pagination(pageNum) {
                console.log("換頁 !", pageNum);
                this.userRequest.get(`/api/jason/admin/products?page=${pageNum}`).then((res) => {
                    console.log(res);
                    console.log(res.data.products);
                    this.pagination = res.data.pagination
                    this.products = res.data.products;
                }).catch((err) => {
                    console.log(err);
                })
            },
            $emit_deletdData() {

            }

        },
        // watch: {
        //     // 建立新的產品 --> 表單驗證 ---> 更新 this.errorMessage --> 切換確認按鈕
        //     addNewData: {
        //         handler(newValue, oldValue) {

        //             //  console.log('wateched !!!', newValue, oldValue);
        //             const error = this.formVadidate() || {};
        //             console.log(error);

        //             this.errorMessage = {}


        //             Object.keys(error).forEach((items) => {
        //                 console.log(this.addNewData[items]);
        //                 // 按下確認前，輸入 input 事件的驗證，
        //                 // this.addNewData[items] !== undefined ==> input 有輸入值
        //                 // this.addNewData[items] === ''
        //                 //
        //                 if (this.addNewData[items] !== undefined || this.addNewData[items] === '') {
        //                     console.log(this.addNewData[items], 1);
        //                     this.errorMessage[items] = String(error[items])
        //                     console.log('  this.errorMessage', this.errorMessage);

        //                 }


        //             })
        //             console.log(Object.entries(error).length === 0);
        //             if (Object.entries(error).length === 0) {
        //                 this.errorMessage.pass = true
        //             }


        //         },
        //         deep: true,
        //         immediate: false

        //     }
        // },

        created() {
            this.checkLogin();
            this.userRequest = axios.create({
                baseURL: 'https://vue3-course-api.hexschool.io/v2',

            })
            console.log(this.sysTemLoader);

        },


    })
    // 換頁元件
    .component('pagination', {

        props: ['pagesNum'],

        /*
          {"total_pages":2,"current_page":1,"has_pre":false,"has_next":true,"category":""}
         */

        template: `<ul class="pagination">
        <li class="page-item" :class="{ disabled:!pagesNum.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click="$emit('change-page',pagesNum.current_page-1)">
            <span aria-hidden="true">&laquo;</span>
        </a>
        </li>
        <li class="page-item"  :class="{ active :pagesNum.current_page === page }"  v-for="page in pagesNum.total_pages ">
            <a class="page-link" href="#" @click.prevent="$emit('change-page',page)"> {{page}} </a>
        </li>

        <li class="page-item" :class="{ disabled:!pagesNum.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click="$emit('change-page',pagesNum.current_page+1)">
            <span aria-hidden="true">&raquo;</span>
        </a>
        </li>
        </ul>`

    })
    // 新增產品
    .component('add-product-modal', {
        props: ['propAddData', 'propSubProductUrl', '', 'formVadidate'],
        data() {
            return {
                addData: {

                },
                subProductUrl: '',
                errorMessage: {

                }
            }
            //   this.addData = this.propaddData;
            //   this.subProductUrl = this.propSubProductUrl;
            /// test
            // this.tempSubProductUrl= this.subProductUrl
        },
        template: `
        <div id="addProductModal" ref="productModal" class="modal fade" data-bs-backdrop="static"
            data-bs-keyboard="false" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 id="productModalLabel" class="modal-title">
                            <span>新增產品</span>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="mb-1">
                                    <div class="form-group">
                                        <label for="imageUrl-main--edit">新增主圖網址</label>
                                        <input id="imageUrl-main--edit" type="text" class="form-control"
                                            placeholder="請輸入主圖連結" v-model="addData.imageUrl">
                                    </div>
                                    <img class="img-fluid" :src="addData.imageUrl" alt="">
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="$emit('add-image',addData.imageUrl) ">
                                        新增圖片
                                    </button>
                                </div>
                                <div class="mb-3">
                                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="$emit('remove-image',addData.imageUrl)">
                                        刪除圖片
                                    </button>
                                </div>

                                <div class="mb-1">
                                    <div class="form-group">
                                        <label for="imageUrl-sub--edit">新增副圖網址</label>
                                        <input id="imageUrl-sub--edit" type="text" class="form-control"
                                            placeholder="請輸入副圖連結" v-model="subProductUrl">
                                    </div>
                                    <img class="img-fluid" :src="subProductUrl" alt="">
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="$emit('add-sub-image',subProductUrl)">
                                        新增圖片
                                    </button>
                                </div>
                                <div>


                                    <ol class="overflow-auto">
                                        <li v-for="(item, index) in addData.imagesUrl" :key="index"
                                            @click="$emit('select-sub-image',item)"> {{item}} </li>
                                    </ol>

                                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="$emit('remove-sub-image',subProductUrl)">
                                        刪除圖片
                                    </button>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title--edit">標題</label>c
                                    <input id="title--edit" type="text" class="form-control" placeholder="請輸入標題"
                                        v-model="addData.title" name="title">
                                    <p class="text-danger">
                                        {{ errorMessage.title }}
                                    </p>


                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="category--edit">分類</label>
                                            <input id="category--edit" type="text" class="form-control"
                                                placeholder="請輸入分類" v-model="addData.category" name="category">
                                            <p class="text-danger">
                                                {{  errorMessage.category  }}
                                            </p>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="unit--edit">單位</label>
                                            <input id="unit--edit" type="text" class="form-control" placeholder="請輸入單位"
                                                v-model="addData.unit" name="unit">
                                            <p class="text-danger">
                                                {{ errorMessage.unit }}
                                            </p>
                                        </div>
                                    </div>



                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="origin_price--edit">原價</label>
                                            <input id="origin_price--edit" type="number" min="0" class="form-control"
                                                placeholder="請輸入原價" v-model="addData.origin_price"
                                                name="origin_price">
                                            <p class="text-danger">

                                                {{ errorMessage.origin_price }}
                                            </p>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="price--edit">售價</label>
                                            <input id="price--edit" type="number" min="0" class="form-control"
                                                placeholder="請輸入售價" v-model="addData.price" name="price">
                                            <p class="text-danger">
                                                {{  errorMessage.price }}
                                            </p>
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="form-group">
                                        <label for="description--edit">產品描述</label>
                                        <textarea id="description--edit" type="text" class="form-control"
                                            placeholder="請輸入產品描述" v-model="addData.description">
             </textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="content--edit">說明內容</label>
                                        <textarea id="content--edit" type="text" class="form-control"
                                            placeholder="請輸入說明內容" v-model="addData.content">
             </textarea>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-check">
                                            <input id="is_enabled--edit" class="form-check-input" type="checkbox"
                                                :true-value="1" :false-value="0" v-model="addData.is_enabled">
                                            <label class="form-check-label" for="is_enabled--edit">是否啟用</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                                @click=" $emit('reset-data--error-message'),subProductUrl=''">
                                取消
                            </button>



                            <button v-if="!errorMessage.pass" type="button" class="btn btn-primary"
                                @click="$emit('add-data-confirm')">
                                確認

                            </button>


                            <button v-else-if="errorMessage.pass" type="button" class="btn btn-primary"
                                @click="$emit('add-data-confirm',addData),subProductUrl=''" data-bs-dismiss="modal">
                                確認

                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        `,

        created() {
            this.subProductUrl = '';
            this.addData = this.propAddData;

        },
        updated() {
            // this.errorMessage =  this.propErrorMessage;
            // this.errorMessage = this.errorMessage
            console.log('788', this.editData, this.subProductUrl);

        },

        watch: {
            // 建立新的產品 --> 表單驗證 ---> 更新 this.errorMessage --> 切換確認按鈕
            addData: {
                handler(newValue, oldValue) {
                    console.log(newValue, oldValue);
                    //  console.log('wateched !!!', newValue, oldValue);
                    const error = this.formVadidate() || {};
                    console.log(error);

                    this.errorMessage = {}
                    console.log();
                    console.log(Object.keys(newValue), error);


                    Object.keys(newValue).forEach((element, index, arr) => {
                        console.log(newValue[element], "|", error[element]);
                        console.log(Boolean(newValue[element]));


                        // this.errorMessage[element] = ""
                        if (newValue[element] !== "" && error[element] === undefined) {
                            // 如果 表單有填值 且 表單驗證沒有錯誤
                            this.errorMessage[element] = ""

                        } else if (newValue[element] !== '' && error[element]) {
                            // 如果 表單有填值 且 表單驗證有錯誤
                            this.errorMessage[element] = String(error[element])

                        }



                        // else {
                        //     // 如果表單沒有錯誤，就將該欄位清空
                        //     this.errorMessage[element] = ''
                        // }

                    });

                    console.log(Object.entries(error).length === 0);
                    if (Object.entries(error).length === 0) {
                        this.errorMessage.pass = true
                    } else {
                        this.errorMessage.pass = false
                    }


                },
                deep: true,
                immediate: false

            },
            // 新增附圖
            propSubProductUrl: {
                handler() {
                    this.subProductUrl = this.propSubProductUrl
                }
            },
            // errorMessage: {
            //     handler() {
            //       this.errorMessage = this.propErrorMessage
            //     },   deep: true,
            //     immediate: false
            // }
        }
    })
    // 編輯產品
    .component('edit-product-modal', {
        props: ['propEditData', 'propSubProductUrl', 'formVadidate'],
        data() {
            return {
                editData: {
                    imageUrl: ''
                },
                subProductUrl: '',

                errorMessage: {

                }
            }
        },
        methods: {

            injectSubProductUrl() {
                this.subProductUrl = this.subProductUrl;
            }

        },
        template: `
        <div id="editProductModal" ref="productModal" class="modal fade" data-bs-backdrop="static"
            data-bs-keyboard="false" tabindex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content border-0">
                    <div class="modal-header bg-dark text-white">
                        <h5 id="productModalLabel" class="modal-title">
                            <span>編輯產品</span>
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="mb-1">
                                    <div class="form-group">
                                        <label for="imageUrl-main--edit">新增主圖網址</label>
                                        <input id="imageUrl-main--edit" type="text" class="form-control"
                                            placeholder="請輸入主圖連結" v-model="editData.imageUrl">
                                    </div>
                                    <img class="img-fluid" :src="editData.imageUrl" alt="">
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="$emit('add-image',editData.imageUrl) ">
                                        新增圖片
                                    </button>
                                </div>
                                <div class="mb-3">
                                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="$emit('remove-image',editData.imageUrl)">
                                        刪除圖片
                                    </button>
                                </div>

                                <div class="mb-1">
                                    <div class="form-group">
                                        <label for="imageUrl-sub--edit">新增副圖網址</label>
                                        <input id="imageUrl-sub--edit" type="text" class="form-control"
                                            placeholder="請輸入副圖連結" v-model="subProductUrl">
                                    </div>
                                    <img class="img-fluid" :src="subProductUrl" alt="">
                                </div>
                                <div>
                                    <button class="btn btn-outline-primary btn-sm d-block w-100" @click="$emit('add-sub-image',subProductUrl)">
                                        新增圖片
                                    </button>
                                </div>
                                <div>


                                    <ol class="overflow-auto">
                                        <li v-for="(item, index) in editData.imagesUrl" :key="index"
                                            @click="$emit('select-sub-image',item)"> {{item}} </li>
                                    </ol>

                                    <button class="btn btn-outline-danger btn-sm d-block w-100" @click="$emit('remove-sub-image',subProductUrl)">
                                        刪除圖片
                                    </button>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="form-group">
                                    <label for="title--edit">標題</label>c
                                    <input id="title--edit" type="text" class="form-control" placeholder="請輸入標題"
                                        v-model="editData.title" name="title">
                                    <p class="text-danger">
                                        {{ errorMessage.title }}
                                    </p>


                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="category--edit">分類</label>
                                            <input id="category--edit" type="text" class="form-control"
                                                placeholder="請輸入分類" v-model="editData.category" name="category">
                                            <p class="text-danger">
                                                {{  errorMessage.category  }}
                                            </p>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="unit--edit">單位</label>
                                            <input id="unit--edit" type="text" class="form-control" placeholder="請輸入單位"
                                                v-model="editData.unit" name="unit">
                                            <p class="text-danger">
                                                {{ errorMessage.unit }}
                                            </p>
                                        </div>
                                    </div>



                                    <div class="row">
                                        <div class="form-group col-md-6">
                                            <label for="origin_price--edit">原價</label>
                                            <input id="origin_price--edit" type="number" min="0" class="form-control"
                                                placeholder="請輸入原價" v-model="editData.origin_price"
                                                name="origin_price">
                                            <p class="text-danger">

                                                {{ errorMessage.origin_price }}
                                            </p>
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="price--edit">售價</label>
                                            <input id="price--edit" type="number" min="0" class="form-control"
                                                placeholder="請輸入售價" v-model="editData.price" name="price">
                                            <p class="text-danger">
                                                {{  errorMessage.price }}
                                            </p>
                                        </div>
                                    </div>
                                    <hr>

                                    <div class="form-group">
                                        <label for="description--edit">產品描述</label>
                                        <textarea id="description--edit" type="text" class="form-control"
                                            placeholder="請輸入產品描述" v-model="editData.description">
             </textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="content--edit">說明內容</label>
                                        <textarea id="content--edit" type="text" class="form-control"
                                            placeholder="請輸入說明內容" v-model="editData.content">
             </textarea>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-check">
                                            <input id="is_enabled--edit" class="form-check-input" type="checkbox"
                                                :true-value="1" :false-value="0" v-model="editData.is_enabled">
                                            <label class="form-check-label" for="is_enabled--edit">是否啟用</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                                @click=" $emit('reset-data--error-message'),subProductUrl=''">
                                取消
                            </button>



                            <button v-if="!errorMessage.pass" type="button" class="btn btn-primary"
                                @click="$emit('edit-data-confirm')">
                                確認

                            </button>


                            <button v-else-if="errorMessage.pass" type="button" class="btn btn-primary"
                                @click="$emit('edit-data-confirm',editData),subProductUrl=''" data-bs-dismiss="modal">
                                確認

                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>

        `,
        created() {
            this.subProductUrl = '';
        },
        updated() {
            this.editData = this.propEditData;
            console.log('788', this.editData, this.subProductUrl);
        },
        watch: {
            // 建立新的產品 --> 表單驗證 ---> 更新 this.errorMessage --> 切換確認按鈕
            editData: {
                handler(newValue, oldValue) {
                    //  console.log('wateched !!!', newValue, oldValue);
                    const error = this.formVadidate() || {};
                    console.log(error);

                    this.errorMessage = {}
                    Object.keys(newValue).forEach((element, index, arr) => {
                        console.log(newValue[element], "|", error[element]);
                        if (newValue[element] && error[element]) {
                            // 如果 表單有填值 且 表單驗證有錯誤
                            this.errorMessage[element] = String(error[element])
                        } else if (newValue[element] === '') {
                            // 如果 表單原本有填值，但把內容清空
                            this.errorMessage[element] = String(error[element])
                        } else {
                            // 如果表單沒有錯誤，就將該欄位清空
                            this.errorMessage[element] = ''
                        }

                    });
                    // Object.keys(error).forEach((items) => {
                    //     console.log(this.editData[items]);
                    //     // 按下確認前，輸入 input 事件的驗證，
                    //     // this.addNewData[items] !== undefined ==> input 有輸入值
                    //     // this.addNewData[items] === ''
                    //     //
                    //     if (this.editData[items] !== undefined || this.editData[items] === '') {
                    //         console.log(this.editData[items], 1);
                    //         this.errorMessage[items] = String(error[items])
                    //         console.log('  this.errorMessage', this.errorMessage);

                    //     }
                    // })
                    console.log(Object.entries(error).length === 0);
                    if (Object.entries(error).length === 0) {
                        this.errorMessage.pass = true
                    } else {
                        this.errorMessage.pass = false
                    }
                },
                deep: true,
                immediate: false

            },
            // 新增附圖
            propSubProductUrl: {
                handler() {
                    this.subProductUrl = this.propSubProductUrl
                }
            }
        }
    })
    .component('delete-modal', {
        template: `
        <div id="delProductModal" ref="delProductModal" class="modal fade" tabindex="-1"
        aria-labelledby="delProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 id="delProductModalLabel" class="modal-title">
                        <span>刪除產品</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    是否刪除
                    <strong class="text-danger"></strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                        取消
                    </button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="$emit('emit-delete')">
                        確認刪除
                    </button>
                </div>
            </div>
        </div>
    </div>
        `,

    })
    .mount("#app");