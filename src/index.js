import FormFront from './FormFront';
import FormBack from './FormBack';
const { render } = wp.element;

// front render
const frontTarget = document.getElementById('cu-form-front');
{frontTarget ? (
    render(<FormFront/>, frontTarget)
):null}

// back render
const backTarget = document.getElementById('cu-form-back');
{backTarget ? (
    render(<FormBack/>, backTarget)
):null}