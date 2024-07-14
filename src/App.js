import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom"

// toastify
import { ToastContainer, toast } from 'react-toastify';
// Lodash
import _ from "lodash"
// Use Immer
import { useImmer } from "use-immer"
// ConfirmAlert
import { confirmAlert } from "react-confirm-alert"
// Context
import { ContactContext } from "./context/contactContext"
// Components
import { Contacts, AddContact, EditContact, ViewContact, Navbar } from "./components"
// Services
import { getAllContacts, getAllGroups, createContact, deleteContact } from "./services/contactService"
// Helpers
import { CURRENTLINE, FOREGROUND, PURPLE, YELLOW, COMMENT } from "./helpers/colors"
const App = () => {
    const [loading, setLoading] = useImmer(false)
    const [contacts, setContacts] = useImmer([])
    const [groups, setGroups] = useImmer([])
    const [filteredContacts, setFilteredContacts] = useImmer([])
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const { data: contactsData } = await getAllContacts()
                const { data: groupsData } = await getAllGroups()
                setContacts(contactsData)
                setFilteredContacts(contactsData)
                setGroups(groupsData)
                setLoading(false)
            } catch (error) {
                console.log(error.message);
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const createContactForm = async (values) => {
        try {
            setLoading(draft => !draft)
            const { status, data } = await createContact(values)
            if (status === 201) {
                toast.success("مخاطب جدید با موفقیت اضافه شد" ,{ icon: "🚀" })
                setContacts(draft => {draft.push(data)})
                setFilteredContacts(draft => {draft.push(data)})

                setLoading(prevLoading => !prevLoading)
                navigate("/contacts")
            }
        } catch (error) {
            console.log(error.message);
            setLoading(draft => !draft)
        }
    }

    const confirmDelete = (contactId, contactFullName) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div dir="rtl" className="p-4" style={{ backgroundColor: CURRENTLINE, border: `1px solid ${PURPLE}`, borderRadius: "1em" }}>
                        <h1 style={{ color: YELLOW }}>پاک کردن مخاطب</h1>
                        <p style={{ color: FOREGROUND }}>
                            مطمئنی که میخوای {contactFullName} رو حذف کنی ؟
                        </p>
                        <button onClick={() => {
                            removeContact(contactId)
                            onClose()
                        }}>مطمئن هستم</button>
                        <button onClick={onClose} className="btn" style={{ backgroundColor: COMMENT }}>انصراف</button>
                    </div>
                )
            }
        })
    }

    const removeContact = async (contactId) => {
        /*
            * NOTE
            * 1- forceRender -> setForceRender(true)
            * 2- Send request server
            * 3- Delete local state
            * 4 - Delete State Before Server Request
            */
        const contactsBackup = [...contacts]
        try {
            setContacts(draft => draft.filter(contact => contact.id !== contactId))
            setFilteredContacts(draft => draft.filter(contact => contact.id !== contactId))

            // Sending delete request to server
            const { status } = await deleteContact(contactId)
            toast.error("مخاطب با موفقیت حذف شد", { icon: "💣" })
            if (status !== 200) {
                setContacts(contactsBackup)
                setFilteredContacts(contactsBackup)
            }
        } catch (error) {
            console.log(error.message);
            setContacts(contactsBackup)
            setFilteredContacts(contactsBackup)
        }
    }

    const contactSearch = _.debounce(query => {
        if (!query) setFilteredContacts([...contacts])
        setFilteredContacts(draft => draft.filter(contact => contact.fullname.toLowerCase().includes(query.toLowerCase())))
    }, 1000)

    return (
        <ContactContext.Provider value={{
            loading,
            setLoading,
            contacts,
            setContacts,
            filteredContacts,
            setFilteredContacts,
            groups,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch
        }}>
            <div className="App">
                <Navbar />
                <ToastContainer theme="colored" rtl={true}/>
                <Routes>
                    <Route path="/" element={<Navigate to="/contacts" />} />
                    <Route path="/contacts"
                        element={<Contacts />} />
                    <Route path="/contacts/add"
                        element={<AddContact />} />
                    <Route path="/contacts/:contactId" element={<ViewContact />} />
                    <Route path="/contacts/edit/:contactId" element={<EditContact />} />
                    <Route />
                </Routes>
            </div>
        </ContactContext.Provider>
    )
}

export default App
