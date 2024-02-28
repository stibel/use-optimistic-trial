import { useOptimistic, useState } from "react";
import { Form, Formik } from "formik";
import { useForm } from "react-hook-form";

async function deliverMessage(message) {
  try {
    await new Promise((resolve, reject) =>
      setTimeout(Date.now() % 2 === 0 ? resolve : reject, 1000),
    );
    return message;
  } catch (e) {
    console.error("Error!");
  }
}
// eslint-disable-next-line react/prop-types
function Thread({ messages, sendMessage }) {
  const [inputValue, setInputValue] = useState("");
  async function formAction() {
    addOptimisticMessage(inputValue);
    await sendMessage(inputValue);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  return (
    <div
      style={{
        width: "33%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Form</h1>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction}>
        <input
          type="text"
          name="message"
          placeholder="Hello!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function FormikThread({ messages, sendMessage }) {
  const [inputValue, setInputValue] = useState("");
  async function formAction() {
    addOptimisticMessage(inputValue);
    await sendMessage(inputValue);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  return (
    <div
      style={{
        width: "33%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Formik</h1>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <Formik initialValues={{ message: "" }} onSubmit={formAction}>
        {() => (
          <Form action={formAction}>
            <input
              type="text"
              name="message"
              placeholder="Hello!"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Send</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function ReactHookFormThread({ messages, sendMessage }) {
  const { register, handleSubmit } = useForm();
  async function formAction(data) {
    addOptimisticMessage(data.message);
    await sendMessage(data.message);
  }
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ],
  );

  return (
    <div
      style={{
        width: "33%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>React Hook Form</h1>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={formAction} onSubmit={handleSubmit(formAction)}>
        <input {...register("message")} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false },
  ]);
  const [FormikMessages, setFormikMessages] = useState([
    { text: "Hello there!", sending: false },
  ]);
  const [ReactHookFormMessages, setReactHookFormMessages] = useState([
    { text: "Hello there!", sending: false },
  ]);

  const sendMessage = (setter) => async (message) => {
    const sentMessage = await deliverMessage(message);
    if (!sentMessage) {
      alert("Failed to send!");
    }
    setter((messages) => [...messages, { text: sentMessage, sending: false }]);
  };

  return (
    <div
      style={{
        padding: "2rem",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Thread messages={messages} sendMessage={sendMessage(setMessages)} />
      <FormikThread
        messages={FormikMessages}
        sendMessage={sendMessage(setFormikMessages)}
      />
      <ReactHookFormThread
        messages={ReactHookFormMessages}
        sendMessage={sendMessage(setReactHookFormMessages)}
      />
    </div>
  );
}
