import React, { useState, useEffect } from 'react';
import NavBarProfessor from '../../../Components/NavBarProfessor'; 

const CreateApplication = () => {
  // {/* Deadline Calander */}
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = tomorrow.toISOString().split('T')[0];
    setMinDate(formatted);
  }, []);

  // {/* On Webpage editable text */}
  const EditableText = ({ label, text, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);
  
    const handleBlur = () => {
      setIsEditing(false);
      onSave(value);
    };
  
    return (
      <div className="flex items-center space-x-2">
        <span className="font-semibold">{label}:</span>
        {isEditing ? (
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-gray-800"
            title="Click to edit"
          >
            {value || 'Click to edit'}
          </span>
        )}
      </div>
    );
  };

  const EditableTextArea = ({ text, onSave }) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [value, setValue] = React.useState(text);
  
    const handleBlur = () => {
      setIsEditing(false);
      onSave(value);
    };
  
    return isEditing ? (
      <textarea
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className="border px-2 py-1 rounded w-full h-32 resize-none"
      />
    ) : (
      <p
        onClick={() => setIsEditing(true)}
        className="text-gray-600 cursor-pointer"
        title="Click to edit"
      >
        {value || 'Click to edit details...'}
      </p>
    );
  };

  return (

    <div className="min-h-screen bg-gray-100">
      <NavBarProfessor />

      {/* Page Name and underline */}
      <div className="text-4xl font-bold ml-6">Create Application</div>
      <div className="w-full border-t border-black my-6"></div>

      <main className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-10"> 
          <div className="box flex flex-row space-x-6">
            {/* Professor Name and Lab Title Box */}
            <div className="flex flex-col space-y-6 w-1/2">
              <div className="bg-orange-100 p-6 rounded-lg">
              <EditableText label="Job Title" text="-------" onSave={(val) => console.log("Job Title:", val)} />
              <EditableText label="Professor Name" text="-------" onSave={(val) => console.log("Professor Name:", val)} />
              <EditableText label="Lab Title" text="-------" onSave={(val) => console.log("Lab Title:", val)} />
              </div>

              {/*Lab Details Box */}
              <div className="bg-orange-100 p-6 rounded-lg">
                <EditableText label="Hours" text=" #" onSave={(int) => console.log("Hours:", int)} />
                <EditableText label="Term" text="Lorem ipsum" onSave={(val) => console.log("Term:", val)} />
                <EditableText label="Room" text="Lorem ipsum" onSave={(val) => console.log("Room:", val)} />
                <EditableText label="Compensation" text="Lorem ipsum" onSave={(int) => console.log("Compensation:", int)} />
                <EditableText label="Contact Info" text="(###) - ### - ####" onSave={(int) => console.log("Contact Info:", int)} />
                <label className="block text-gray-600 font-semibold mt-2">Deadline:</label>
                <input
                  type="date"
                  min={minDate}
                  className="border rounded px-3 py-1 mt-1"
                />
              </div>
            </div>

            {/* Details Box */}
            <div className="w-1/2 pl-6">
              <h3 className="text-md font-semibold">Details: </h3>
              <EditableTextArea
                text="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                onSave={(val) => console.log("Details:", val)}
              />
            </div>

          </div>

          {/* Save Button Below Details */}
          <div className="max-w-4xl mx-auto flex justify-end mt-4">
            <button
              onClick={() => alert('Changes saved!')}
              className="bg-orange-300 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded shadow"
            >
              Save 
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateApplication