import {EditorView, highlightActiveLineGutter, keymap, lineNumbers} from "@codemirror/view";
import {EditorState} from "@codemirror/state";
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
import {bracketMatching, foldGutter, foldKeymap, HighlightStyle, indentOnInput, syntaxHighlighting} from "@codemirror/language";
import {yaml} from "@codemirror/lang-yaml";
import {tags as t} from "@lezer/highlight";
import {linter, lintGutter, lintKeymap} from "@codemirror/lint";

import jsyaml from 'js-yaml';

window.jsyaml = jsyaml;

const draculaTheme = EditorView.theme({
    "&": {
        color: "#f8f8f2",
        backgroundColor: "#282a36"
    },
    ".cm-content": {caretColor: "#aeafad"},
    ".cm-cursor, .cm-dropCursor": {borderLeftColor: "#aeafad"},
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {backgroundColor: "#44475a"},
    ".cm-gutters": {
        backgroundColor: "#282a36",
        color: "#6272a4",
        border: "none"
    },
    ".cm-activeLineGutter": {backgroundColor: "#44475a"},
}, {dark: true});

const draculaHighlightStyle = HighlightStyle.define([
    {tag: t.keyword, color: "#ff79c6"},
    {tag: t.string, color: "#f1fa8c"},
    {tag: t.comment, color: "#6272a4"},
    {tag: t.invalid, color: "#ff5555"},

    {
        tag: [
            t.bool,
            t.atom,
            t.number,
            t.null,
            t.keyword,
            t.literal
        ],
        color: "#bd93f9"
    },

    {
        tag: [t.propertyName, t.attributeName, t.labelName],
        color: "#bd93f9"
    },

    {tag: t.punctuation, color: "#f8f8f2"},
    {tag: t.operator, color: "#ff79c6"}
]);

window.CM6 = {
    create: (el, doc, cb) => new EditorView({
        parent: el,
        state: EditorState.create({
            doc: doc,
            extensions: [
                lineNumbers(),
                highlightActiveLineGutter(),
                foldGutter(),
                history(),
                bracketMatching(),
                indentOnInput(),
                draculaTheme,
                syntaxHighlighting(draculaHighlightStyle),
                yaml(),
                lintGutter(),
                linter(view => {
                    let diagnostics = [];
                    try {
                        window.jsyaml.load(view.state.doc.toString());
                    } catch (e) {
                        const loc = e.mark || {line: 0, column: 0};
                        const pos = view.state.doc.line(loc.line + 1).from + loc.column;

                        diagnostics.push({
                            from: pos,
                            to: pos,
                            severity: "error",
                            message: e.reason || e.message,
                        });
                    }
                    return diagnostics;
                }),
                keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...lintKeymap]),
                EditorView.updateListener.of(v => v.docChanged && cb && cb(v.state.doc.toString()))
            ]
        })
    })
};
