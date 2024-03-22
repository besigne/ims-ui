import React from 'react'
import { Editor } from '@monaco-editor/react';
import { Box } from '@mui/material';

interface SQLCodeEditorProps {
  defaultValue: string;
  onChange: (value: string | undefined) => void;
}

const SQLCodeEditor: React.FC<SQLCodeEditorProps> = ({ defaultValue, onChange }) => {
  const editorRef = React.useRef<any>(null);


  return (
    <Box sx={{height: '600px'}}>
      <Editor
        defaultLanguage="sql"
        defaultValue={defaultValue}
        onChange={(value) => onChange(value)}
        theme="vs-dark"
        options={{
          formatOnPaste: true,
          formatOnType: true,
          minimap: { enabled: false },
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            vertical:"hidden",
            horizontal: "hidden",
            handleMouseWheel: true,
        },
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
        }}
      />
    </Box>
  )
}

export default SQLCodeEditor