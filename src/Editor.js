import React, { Component } from "react";
import { Editor, Modifier, EditorState, SelectionState } from "draft-js";
import getEntityKeyForSelection from "draft-js/lib/getEntityKeyForSelection";
import "./App.css";

function updateContent(text, editorState, anchor, focus) {
  let selectionState;
  let contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getFirstBlock();
  const currentText = currentBlock.getText();
  if (typeof anchor === "number") {
    if (anchor > currentText.length) {
      anchor = currentText.length;
    }
    if (focus > currentText.length) {
      focus = currentText.length;
    }
    selectionState = new SelectionState({
      anchorKey: currentBlock.getKey(),
      anchorOffset: anchor,
      focusKey: currentBlock.getKey(),
      focusOffset: focus || anchor
    });
  } else {
    selectionState = editorState.getSelection();
  }
  const inlineStyle = editorState.getCurrentInlineStyle();
  const entityKey = getEntityKeyForSelection(contentState, selectionState);

  let changeType;
  if (selectionState.isCollapsed()) {
    contentState = Modifier.insertText(
      contentState,
      selectionState,
      text,
      inlineStyle,
      entityKey
    );
    changeType = "insert-characters";
  } else {
    contentState = Modifier.replaceText(
      contentState,
      selectionState,
      text,
      inlineStyle,
      entityKey
    );
    changeType = "replace-characters";
  }

  return EditorState.push(editorState, contentState, changeType);
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
