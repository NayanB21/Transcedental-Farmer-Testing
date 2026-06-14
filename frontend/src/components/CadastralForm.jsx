// src/components/CadastralForm.jsx
import React from "react";

export default function CadastralForm({ value, onChange, onEdit }) {
  const handle = (e) => { onEdit?.(); onChange({ ...value, [e.target.name]: e.target.value }); };
  /*({ value, onChange }): In React, components receive instructions from a parent component. 
  These instructions are called "props". The curly braces mean we are extracting two specific
   instructions out of the props:value: The current data inside the form (e.g., { name: "", address: "" }).onChange:
    A function that tells the parent "Hey, the user typed something, update the data!"Line 2: const handle = (e) => onChange({ ...value, [e.target.name]: e.target.value });
   This line creates a quick function called handle that runs every single time the user presses a key in the form.(e) =>: When the user types, it captures the keystroke as an event (represented by e)
    ....value: It copies the current state of the form.[e.target.name]: e.target.value: It looks at the specific input box the user just typed into (e.target), finds its name attribute,
     and sets its value to whatever the user just typed (e.target.value).onChange(...): It takes the newly updated form data (the old data + the newly typed letter) and sends it up to the parent component so the screen updates.*/ 
  return (
    <div className="card animate-in">
      <div className="section-label">Step 2 — Land Location</div>
      <h2>📍 Land Location / भूमि स्थान</h2>
      <div className="grid">
        <label>
          State / राज्य
          <input
            value="West Bengal"
            readOnly
            title="Currently supporting West Bengal only"
          />
        </label>

        <label>
          District / ज़िला
          <input
            name="district"
            value={value.district || ""}
            onChange={handle}
            placeholder="e.g. Paschim Medinipur"
          />
        </label>

        <label>
          Tehsil / Taluk / तहसील
          <input
            name="tehsil"
            value={value.tehsil || ""}
            onChange={handle}
            placeholder="e.g. Debra"
          />
        </label>

        <label>
          Village / गाँव
          <input
            name="village"
            value={value.village || ""}
            onChange={handle}
            placeholder="e.g. Mohanpur"
          />
        </label>

        {/* <label>
          Khasra/Survey No. / खसरा
          <input name="surveyNo" value={value.surveyNo || ""} onChange={handle} placeholder="e.g., 123/4A" />
        </label> */}
      </div>
    </div>
  );
}
