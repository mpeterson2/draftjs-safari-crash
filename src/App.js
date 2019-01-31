import React, { Component } from "react";
import { Editor, Modifier, EditorState } from "draft-js";
import getEntityKeyForSelection from "draft-js/lib/getEntityKeyForSelection";
import "./App.css";

class App extends Component {
  state = {
    editorState: new EditorState.createEmpty()
  };

  handleBeforeInput = (character: string) => {
    console.log("called", character);
    const { editorState } = this.state;
    const selectionState = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const inlineStyle = editorState.getCurrentInlineStyle();
    const entityKey = getEntityKeyForSelection(contentState, selectionState);
    const newContentState = Modifier.insertText(
      contentState,
      selectionState,
      character,
      inlineStyle,
      entityKey
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );
    this.setState({ editorState: newEditorState });
  };

  handleChange = () => {};

  render() {
    return (
      <div className="app">
        <Editor
          className="editor"
          editorState={this.state.editorState}
          handleBeforeInput={this.handleBeforeInput}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default App;
