function Form({ FormDetails: FormDetailsType, SubmitCallback }) {
  function DoNothing() {}

  const exampleFormDetails = {
    Email: {
      Type: "email",
      Label: "Email",
    },
    Password: {
      Type: "password",
      Label: "Password",
    },
    $submit: "Login",
  };

  return (
    <form onSubmit={SubmitCallback ? SubmitCallback : DoNothing}>
      {Object.entries(FormDetails).map(([key, val]) => {
        if (key != "$submit") {
          return (
            <div key={key}>
              {val.Label ? <label htmlFor={key}>{val.Label}</label> : null}
              <input type={val.Type || "text"} name={key} id={key} />
            </div>
          );
        }
        return null;
      })}
      <button type="submit">
        {FormDetails["$submit"] || "Submit"}
      </button>
    </form>
  );
}

export default Form;
