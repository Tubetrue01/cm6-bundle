# CodeMirror 6 YAML Bundle for OpenWrt LuCI

A specialized **CodeMirror 6** distribution designed for OpenWrt LuCI developers. This bundle consolidates the editor core, YAML language support, Dracula theme, and `js-yaml` based linting into a single, compact JavaScript file.

### ✨ Features

- **Ultra-Lightweight**: ~400KB minified (including the `js-yaml` parser).
- **Self-Contained**: Single file delivery. No external CSS required (styles are injected via JS).
- **Fully Featured**:
    - 🌙 **Dracula Theme**: The classic deep-purple dark mode.
    - 🔍 **Real-time Linting**: Automatic YAML syntax validation with visual error markers.
    - 📑 **Core Enhancements**: Line numbers, code folding, and bracket matching.
    - ⌨️ **Keymap Support**: Includes standard shortcuts for Undo, Search, and Folding.
- **LuCI Optimized**: Designed to work with LuCI's asynchronous loading and form-value synchronization.

### 📦 Installation

1. Download the `dist/cm6-yaml-editor.js` from this repository.
2. Upload it to your LuCI static resource directory:
   `/www/luci-static/resources/view/your_plugin/cm6-yaml-editor.js`

### 🛠 Usage in LuCI

In your LuCI JavaScript view:

```javascript
// 1. Load the resource
async function loadEditor() {
    const bundlePath = '/luci-static/resources/view/your_plugin/cm6-yaml-editor.js';
    if (!window.CM6) {
        // Using a dynamic script tag or L.require
        await L.require(bundlePath);
    }
}

// 2. Initialize in the render function
o.render = function(sectionId, optionId, value) {
    return form.TextValue.prototype.render.apply(this, [sectionId, optionId, value])
        .then(node => {
            const textarea = node.querySelector('textarea');
            textarea.style.display = 'none';

            const container = document.createElement('div');
            container.className = 'cm6-container';
            textarea.parentNode.insertBefore(container, textarea);

            loadEditor().then(() => {
                if (window.CM6) {
                    // Create the editor instance
                    this.editor = window.CM6.create(container, textarea.value, (content) => {
                        textarea.value = content;
                    });
                }
            });
            return node;
        });
};

// 3. Ensure formvalue synchronization
o.formvalue = function(sectionId) {
    if (this.editor && this.editor.state) {
        return this.editor.state.doc.toString();
    }
    return this.super('formvalue', [sectionId]);
};
