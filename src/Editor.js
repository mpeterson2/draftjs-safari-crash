import React, { Component } from "react";
import { Editor, Modifier, EditorState, SelectionState } from "draft-js";
import getEntityKeyForSelection from "draft-js/lib/getEntityKeyForSelection";
import "./App.css";

const MAX_LENGTH = 512;

function getFirstTextBlock(editorState) {
  return editorState
    .getCurrentContent()
    .getFirstBlock()
    .getText();
}

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

function truncateContent(editorState, maxLength = 512) {
  const query = getFirstTextBlock(editorState);
  if (query.length > maxLength) {
    let selectionState = editorState.getSelection();
    editorState = updateContent("", editorState, maxLength, query.length);
    // Adapt the old selection selection after truncation
    if (selectionState.getAnchorOffset() > maxLength) {
      selectionState = selectionState.set("anchorOffset", maxLength);
    }
    if (selectionState.getFocusOffset() > maxLength) {
      selectionState = selectionState.set("focusOffset", maxLength);
    }
    editorState = EditorState.forceSelection(editorState, selectionState);
  }
  return editorState;
}

function isContainedWithin(node, parentNode) {
  while (node) {
    if (node === parentNode) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function scrollCursorIntoView(editorEl) {
  const selection = window.getSelection();
  // We should ONLY update Caret, i.e. Collapsed selections
  if (!selection || selection.type !== "Caret" || !editorEl) {
    return;
  }
  // We should only act on selections within our editor
  const range = selection.getRangeAt(0);
  if (!isContainedWithin(range.commonAncestorContainer, editorEl)) {
    return;
  }
  const rangeRect = range.getClientRects()[0];
  const editorRect = editorEl.getClientRects()[0];
  if (!rangeRect || !editorRect) {
    return;
  }
  // Calculate position of caret from getClientRects and ensure it's visible
  const left = rangeRect.left - editorRect.left;
  const scrollLeft = left + editorEl.scrollLeft;
  if (scrollLeft < editorEl.scrollLeft) {
    editorEl.scrollLeft = scrollLeft - 10;
  } else if (scrollLeft > editorEl.scrollLeft + editorEl.offsetWidth) {
    editorEl.scrollLeft = scrollLeft - editorEl.offsetWidth + 3;
  }
}

class MyEditor extends Component {
  componentDidUpdate(prevProps) {
    const { editorState } = this.props;
    if (editorState !== prevProps.editorState) {
      if (this._editorRef) {
        scrollCursorIntoView(this._editorRef.refs.editor);
      }
    }
  }

  setEditorState = editorState => {
    this.props.setEditorState(editorState);
  };

  handleBeforeInput = (character: string) => {
    let { editorState } = this.props;
    const query = getFirstTextBlock(editorState);
    if (query.length >= MAX_LENGTH) {
      return true;
    }
    editorState = updateContent(character, editorState);
    // Probs never needed, but here as a safety (i.e. if character ever
    // happened to be more than 1 char)
    editorState = truncateContent(editorState, MAX_LENGTH);
    // editorState = this.tokenize(editorState);
    this.setEditorState(editorState);
    return true;
  };

  handleChange = () => {};

  render() {
    return (
      <div className="app">
        <Editor
          className="editor"
          editorState={this.props.editorState}
          handleBeforeInput={this.handleBeforeInput}
          onChange={this.setEditorState}
        />
      </div>
    );
  }
}

export default MyEditor;
