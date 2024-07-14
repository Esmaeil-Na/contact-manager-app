import { useEffect, useState, useContext } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

import { useImmer } from "use-immer"
// toastify
import { toast } from 'react-toastify';

import { Formik, Form, ErrorMessage, Field } from "formik"
import { ContactContext } from "../../context/contactContext"
import { contactSchema } from "../../validations/contactValidation"
import { getContact, updateContact } from "../../services/contactService"
import { COMMENT, GREEN, PURPLE } from "../../helpers/colors"
import Spinner from "../Spinner"
const EditContact = () => {
    const { contactId } = useParams()
    const { contacts, setContacts, setFilteredContacts, loading, setLoading, groups } = useContext(ContactContext)
    const navigate = useNavigate()
    const [contact, setContact] = useImmer({})

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const { data: contactData } = await getContact(contactId)
                setLoading(false)
                setContact(contactData)
            } catch (error) {
                console.log(error.message);
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const submitForm = async (values) => {
        try {
            setLoading(true)
            const { status, data } = await updateContact(values, contactId)
            /*
            * NOTE
            * 1- forceRender -> setForceRender(true)
            * 2- Send request server
            * 3- Update local state
            */
            if (status === 200) {
                setLoading(false)
                toast.info("مخاطب با موفقیت ویرایش شد", { icon: "✅" })

                setContacts(draft => {
                    const contactIndex = draft.findIndex(c => c.id === parseInt(contactId))
                    draft[contactIndex] = { ...data }
                })
                setFilteredContacts(draft => {
                    const contactIndex = draft.findIndex(c => c.id === parseInt(contactId))
                    draft[contactIndex] = { ...data }
                })
                navigate("/contacts")
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false)
        }
    }

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <section className="p-3">
                    <img
                        src={require("../../assets/man-taking-note.png")}
                        height="400px"
                        style={{
                            position: "absolute",
                            zIndex: "-1",
                            top: "130px",
                            left: "100px",
                            opacity: "50%"
                        }}
                    />
                    <div className="container">
                        <div className="row">
                            <div className="colr">
                                <p className="h4 fw-bold text-center"
                                    style={{ color: GREEN }}>
                                    ویرایش مخاطب
                                </p>
                            </div>
                        </div>
                        <hr style={{ backgroundColor: GREEN }} />
                        <div className="row mt-5">
                            <div className="col-md-4">
                                <Formik
                                    initialValues={contact}
                                    validationSchema={contactSchema}
                                    onSubmit={(values) => {
                                        submitForm(values);
                                    }}
                                >
                                    <Form>
                                        <div className="mb-2">
                                            <Field
                                                name="fullname"
                                                type="text"
                                                className="form-control"
                                                placeholder="نام و نام خانوادگی"
                                            />
                                            <ErrorMessage
                                                name="fullname"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <Field
                                                name="photo"
                                                type="text"
                                                className="form-control"
                                                placeholder="آدرس تصویر"
                                            />

                                            <ErrorMessage
                                                name="photo"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <Field
                                                name="mobile"
                                                type="number"
                                                className="form-control"
                                                placeholder="شماره موبایل"
                                            />

                                            <ErrorMessage
                                                name="mobile"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <Field
                                                name="email"
                                                type="email"
                                                className="form-control"
                                                placeholder="آدرس ایمیل"
                                            />

                                            <ErrorMessage
                                                name="email"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <Field
                                                name="job"
                                                type="text"
                                                className="form-control"
                                                placeholder="شغل"
                                            />

                                            <ErrorMessage
                                                name="job"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <Field
                                                name="group"
                                                as="select"
                                                className="form-control"
                                            >
                                                <option value="">انتخاب گروه</option>
                                                {groups.length > 0 &&
                                                    groups.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))}
                                            </Field>

                                            <ErrorMessage
                                                name="group"
                                                render={(msg) => (
                                                    <div className="text-danger">{msg}</div>
                                                )}
                                            />
                                        </div>
                                        <div className="mx-2">
                                            <input
                                                type="submit"
                                                className="btn"
                                                style={{ backgroundColor: PURPLE }}
                                                value="ویرایش مخاطب"
                                            />
                                            <Link
                                                to={"/contacts"}
                                                className="btn mx-2"
                                                style={{ backgroundColor: COMMENT }}
                                            >
                                                انصراف
                                            </Link>
                                        </div>
                                    </Form>
                                </Formik>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default EditContact