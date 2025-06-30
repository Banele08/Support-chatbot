import React, { useState } from "react";

function SubmitTicket() {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = async (e) => {
        e.prveventDefault();
        //make API Call
        console.log("Ticket submitted:", {title, message});
        setTitle("");
        setMessage("");

    };
    return (
        <form onSubmit={handleSubmit}> 
        <input 
        type="text"
        placeholder="Ticket Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
    /> 
    <textarea 
        placeholder="Ticket Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        />
    <button type= "submit"> Submit Ticket   </button>
    
    </form>
    );
}
export default SubmitTicket;