import sign from "./sign"
import addressList from "./addressList"
export default {
    // "GET /api/user/list": {
    //     statusCode: 200,
    //     message: "success",
    //     data: [
    //         {
    //             id: 1,
    //             name: "zs",
    //             age: "23",
    //             job: "前端工程师",
    //         },
    //         {
    //             id: 2,
    //             name: "ww",
    //             age: "24",
    //             job: "后端工程师",
    //         },
    //     ],
    // },


    ...sign,
    ...addressList
}
