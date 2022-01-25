import axios from 'axios';
import Form from './Form';
// import DeletePerson from './DeletePerson';
const { Component } = wp.element;

// plugin back
class FormBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            persons: [],
            updateForm: false,
            updatePersonId: '',
            updatePersonName: '',
            updatePersonEmail: '',
        }
    }

    // show/hide add form
    toggleForm = () => {
        this.setState({ showForm: !this.state.showForm });
    };

    // get persons
    getPersons = () =>{
        let formData = new FormData();
        formData.append('action', 'get_from_db');

        var self = this;
        axios
        .post('/wp-admin/admin-ajax.php', formData)
        .then(function(response){
            self.setState({ persons: response.data });
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    componentDidMount(){
       this.getPersons();
    }

    // show update form
    showUpdateForm = (person_id, person_name, person_email) =>{
        this.setState({ 
            updateForm: true,
            updatePersonId: person_id,
            updatePersonName: person_name,
            updatePersonEmail: person_email
        });
    }

    // hide update form
    hideUpdateForm = () =>{
        this.setState({ 
            updateForm: false,
            updatePersonId: '',
            updatePersonName: '',
            updatePersonEmail: ''
        });
    }

    // undate person
    updatePerson = () =>{
        // e.preventDefault();

        let formData = new FormData();
        formData.append('action', 'update_to_db');
        formData.append('updateId', this.state.updatePersonId)
        formData.append('updateName', this.state.updatePersonName)
        formData.append('updateEmail', this.state.updatePersonEmail)

        axios
        .post('/wp-admin/admin-ajax.php', formData)
        .then(function (response) {
            if(response.status == 200){
                alert('Form has been submitted');
            }else{
                alert('Something went wrong');
            }
        })
        .catch(function (error) {
            console.log(error);
        });

        // clear and close form
        this.hideUpdateForm();
        this.getPersons();
    }

    // delete person
    deletePerson(person_id){
        let formData = new FormData();
        formData.append('action', 'delete_from_db');
        formData.append('id', person_id)

        axios
        .post('/wp-admin/admin-ajax.php', formData)
        .catch(function (error) {
            console.log(error);
        });

        // get persons after delete
        this.getPersons();
    }

    render() {
    return (
        <>
            {/* page layout */}
            <h1>Persons form</h1>
            <p>Add this shortcode to the page/post editor <strong>[custom_form_shortcode]</strong>.</p>
            {this.state.showForm === false ? (
                <button className="form-btn top-btn add" onClick={this.toggleForm}>Add person</button>
            ):(
                <>
                    <button className="form-btn top-btn remove" onClick={this.toggleForm}>Hide form</button>
                    <div className="cu-add-form-wrap">
                        <Form getPersons={this.getPersons()}/>
                    </div>
                </>
            )}

            {/* table */}
            <div className="cu-table">
                <div className="cu-table-item desc-row">
                    <span>ID</span>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Update person</span>
                    <span>Delete person</span>
                </div>
                {this.state.persons.map((person, index) => (
                    <div className="cu-table-item table-row" key={index}>
                        <span>{person.person_id}</span>
                        <span>{person.person_name}</span>
                        <span>{person.person_email}</span>
                        <span><button className="form-btn add" onClick={() => this.showUpdateForm(person.person_id, person.person_name, person.person_email)}>Update person</button></span>
                        <span><button className="form-btn remove" onClick={() => this.deletePerson(person.person_id)}>Delete person</button></span>
                    </div>
                ))}
            </div>

            {/* update person popup */}
            {this.state.updateForm === true ? (
                <div className="cu-update-popup">
                    <h2>Update person data</h2>
                    <form onSubmit={() => this.updatePerson()}>
                        <input
                            type="text"
                            required
                            value={this.state.updatePersonName}
                            onChange={e => this.setState({updatePersonName: e.target.value})}
                            />
                        <input
                            type="email"
                            required
                            value={this.state.updatePersonEmail}
                            onChange={e => this.setState({updatePersonEmail: e.target.value})}
                        />
                        <input className="form-btn add" type="submit" value="Save"/>
                    </form>
                    <button className="form-btn remove" onClick={() => this.hideUpdateForm()}>Close</button>
                </div>
            ):null}
        </>
    );
  }
}

export default FormBack;