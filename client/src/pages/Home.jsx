import Form from "../components/common/Form.jsx"

function Home () {
    const formData = {
        Email: {
            Type: "email",
            Label: "Email",
        },
        Password: {
            Type: "password",
            Label: "Password",
        },
        $submit: "Login",
    }
    
    return (<>
        <div className="content">
            <h1>Welcome to the Home Page!</h1>
            <h2>Want to order?</h2>
        </div>
    </>)
}

export default Home