import axios from 'axios';
const { Component } = wp.element;

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();

        let formData = new FormData();
        formData.append('action', 'send_to_db');
        formData.append('name', this.state.name)
        formData.append('email', this.state.email)
     
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

        // clear form
        this.setState({
            name: '',
            email: '',
        });
    }

    render(){ 
        return(
            <form onSubmit={e => this.handleFormSubmit(e)}>
                <label for="name">Name</label>
                <input 
                    id="name"
                    name="name"
                    type="text"
                    value={this.state.name}
                    required
                    onChange={e => this.setState({name: e.target.value})}
                />
                <label for="email">Email</label>
                <input 
                    id="email" 
                    type="email" 
                    name="email"
                    value={this.state.email}
                    required
                    onChange={e => this.setState({ email: e.target.value })}
                />
                <input 
                    type="submit" 
                    value="Submit"
                />
            </form>
        );
    }
};

export default Form;