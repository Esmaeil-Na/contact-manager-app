import * as Yup from "yup"

export const contactSchema = Yup.object().shape({
    fullname : Yup.string().required("نام و نام خانوادگی الزامی است"),
    photo : Yup.string().url("آدرس معتبر نیست").required("تصویر مخاطب الزامی است"),
    mobile : Yup.number().required("شماره موبایل الزامی است"),
    email : Yup.string().email("آدرس ایمیل معتبر نیست").required("آدرس ایمیل الزامی است"),
    job : Yup.string().nullable(),
    group : Yup.string().required("انتخاب گروه الزامی است")
})