import React, { Component } from "react";
import { EditorState } from "draft-js";
import Editor from "./Editor";
import "./App.css";

class App extends Component {
  state = {
    editorState: new EditorState.createEmpty()
  };

  handleSetEditorState = editorState => {
    this.setState({ editorState });
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        setEditorState={this.handleSetEditorState}
      />
    );
  }
}

export default App;
