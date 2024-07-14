import { useContext } from "react"
import { ContactContext } from "../../context/contactContext"
import { PURPLE } from "../../helpers/colors"
const SearchContact = () => {
    const {contactSearch} = useContext(ContactContext)
    return (
        <div className="col">
            <div className="input-group mx-2 w-75" dir="ltr">
                <span className="input-group-text" id="basic-addon1" style={{ backgroundColor: PURPLE }}>
                    <i className="fas fa-search"></i>
                </span>
                <input 
                onChange={event => contactSearch(event.target.value)}
                type="text" dir="rtl"  
                className="form-controll" 
                placeholder="جستجوی مخاطب" 
                aria-label="Search" 
                aria-describedby="basic-addon1" />
            </div>
        </div>
    )
}

export default SearchContact