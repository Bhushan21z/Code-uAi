import { useState } from 'react';
import { useSandpack } from "@codesandbox/sandpack-react";

const FileManagement = () => {
    const { sandpack } = useSandpack();
    const [newFileName, setNewFileName] = useState('');
  
    const handleCreateFile = () => {
      if (newFileName) {
        sandpack.addFile(`/${newFileName}`, '');
        setNewFileName('');
      }
    };
  
    return (
      <div className="file-creation">
        <input 
          type="text" 
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name (e.g., newfile.js)"
          style={{
            marginRight: '10px',
            padding: '5px',
            width: '155px'
          }}
        />
        <button 
          onClick={handleCreateFile}
          style={{
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create
        </button>
      </div>
    );
};

export default FileManagement;
