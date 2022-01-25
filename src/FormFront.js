import Form from './Form';
const { Component } = wp.element;

// plugin front
class FormFront extends Component {
    render() {
    return (
        <div className="cu-form-container">
            <div className="cu-form-wrap">
                <div className="cu-form">
                    <Form/>
                </div>
            </div>
        </div>
    );
  }
}

export default FormFront;