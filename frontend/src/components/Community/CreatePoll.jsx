import { useState } from "react";
import axios from "axios";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [poll,setpoll]=useState("")

  const addOption = () => setOptions([...options, ""]);

  const handleOptionChange = (i, value) => {
    const updated = [...options];
    updated[i] = value;
    setOptions(updated);
  };

  const createPoll = async () => {
    const res=await axios.post("http://localhost:3000/api/admin/poll", { question, options });
   if(res.data.success)
    { setpoll("Poll created")
    setOptions([""])
    setQuestion("")
    }
   
  };

  return (
    <div className="p-4 bg-white w-150 rounded shadow">
      <h2 className="text-lg font-bold">Create Poll</h2>
      <p className="text-green-300">{poll}</p>
      <input
        type="text"
        placeholder="Enter Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full mt-2"
      />
      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          className="border p-2 w-full mt-2"
        />
      ))}
      <div className="flex gap-3">
      <button onClick={addOption} className="bg-gray-200 p-2 mt-4 rounded">
        + Add Option
      </button>
      <button onClick={createPoll} className="bg-blue-500 text-white p-2 mt-4 rounded">
        Create Poll
      </button>
      </div>
    </div>
  );
}
