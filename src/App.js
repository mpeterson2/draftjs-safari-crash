import React, { Component } from "react";
import { EditorState } from "draft-js";
import Editor from "./Editor";
import "./App.css";

class App extends Component {
  state = {
    editorState1: EditorState.createEmpty(),
    editorState2: EditorState.createEmpty()
  };

  handleSetEditorState1 = editorState1 => {
    this.setState({ editorState1 });
  };

  handleSetEditorState2 = editorState2 => {
    this.setState({ editorState2 });
  };

  render() {
    const { editorState1, editorState2 } = this.state;

    return (
      <div className="app">
        <div>Works</div>
        <div className="wrapper">
          <Editor
            editorState={editorState1}
            setEditorState={this.handleSetEditorState1}
          />
        </div>
        <div>Throws (no-wrap)</div>
        <div className="wrapper no-wrap">
          <Editor
            editorState={editorState2}
            setEditorState={this.handleSetEditorState2}
          />
        </div>
      </div>
    );
  }
}

export default App;
