import React, { Component } from "react";
import { Editor, Modifier, EditorState } from "draft-js";
import "./App.css";

function updateContent(text, editorState) {
  let contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const inlineStyle = editorState.getCurrentInlineStyle();

  contentState = Modifier.insertText(
    contentState,
    selectionState,
    text,
    inlineStyle
  );

  return EditorState.push(editorState, contentState, "insert-characters");
}

class MyEditor extends Component {
  handleBeforeInput = character => {
    let { editorState, setEditorState } = this.props;
    editorState = updateContent(character, editorState);
    setEditorState(editorState);
    return true;
  };

  render() {
    return (
      <Editor
        editorState={this.props.editorState}
        handleBeforeInput={this.handleBeforeInput}
        onChange={this.props.setEditorState}
      />
    );
  }
}

export default MyEditor;
