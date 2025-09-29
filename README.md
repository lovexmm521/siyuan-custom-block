Hello, future SiYuan Note creator!

Welcome to this beginner's guide tailored for Custom Blocks. This guide is designed to help friends like you who are eager to create powerful interactive features in SiYuan Note but don't know where to start. I will take you from scratch, step by step, to set up a professional front-end development environment and ultimately create your own fully functional interactive custom block.

### [中文简体说明](https://github.com/lovexmm521/siyuan-custom-block-js/blob/main/README_zh_CN.md "null")

### Prologue: Prerequisites

Before you start coding, you need to ensure that the following tools are installed on your computer. These are the cornerstones of modern front-end development.

- **Node.js**: All our development is based on the Node.js environment. Please visit the [Node.js official website](https://nodejs.org/ "null") to download and install the latest LTS (Long-Term Support) version. The `npm` package manager will be installed along with it.
- **pnpm (Recommended)** : This is a faster and more efficient package manager. After installing Node.js, run the following command in your terminal (Terminal or PowerShell) to install it:

  ```
  npm install -g pnpm

  ```
- **Code Editor**: **Visual Studio Code (VS Code)**  is highly recommended. It has excellent support for TypeScript and SCSS, which will greatly enhance your development experience.

### Step 1: Initialize Your Project

Unlike plugin development, our custom block project is more lightweight and can start from a clean folder.

1. **Create a project folder**: Create a new folder where you want to store your code, for example, `siyuan-custom-block`.
2. **Enter and initialize**: Open your terminal, navigate into this newly created folder, and then run the following commands to initialize the project:

    ```
    cd siyuan-custom-block
    pnpm init

    ```

   This command will generate a `package.json` file for you, which is the "ID card" of our project.

### Step 2: Understand and Configure the Project Structure

Now, open the `siyuan-custom-block` folder with VS Code. We need to manually create some files and directories to set up our development framework.

**1. Create Directories and Files**Please create the corresponding folders and blank files in your project according to the structure below:

```
siyuan-custom-block/
├── src/              # All your source code will go here
│   ├── modules/      # (Optional) For storing sub-modules of complex features
│   ├── index.ts      # The main entry file for JS/TS
│   └── style.scss    # The main entry file for styles
├── package.json      # The project's package management file (already generated)
├── tsconfig.json     # TypeScript configuration file
└── webpack.config.js # Webpack bundling configuration file (the project's "engine")

```

**2. Fill in the Configuration Files**Next, copy and paste the configuration content we discussed and finalized into the corresponding files. These files together form our powerful and stable development environment.

- **`package.json`** (Project Manifest & Scripts): Defines project dependencies (including SCSS tools) and convenient commands like `build`/`dev`.
- **`webpack.config.js`** (Bundling Core): This is the "brain" of the entire workflow. It is responsible for intelligently converting our modular `src` code, written in TypeScript and SCSS, into a single JavaScript and a single CSS file that SiYuan Note can execute seamlessly.
- **`tsconfig.json`** (TS Compiler Config): Tells the TypeScript compiler how to check and compile our code.

**3. Install Dependencies**After configuring `package.json`, run the following command in the terminal. pnpm will automatically download and install all the development tools we need:

```
pnpm install

```

### Step 3: Write Your First Custom Block Feature (with SCSS Power)

With the environment ready, let's create an interactive feature with professional styling: **Create a button within the block that has a hover effect and, when clicked, displays a notification using SiYuan's API.**

**1. Write the Styles (****`src/style.scss`** **)** First, let's focus on the "look". Open `src/style.scss` and paste the following SCSS code into it.

```
/* Create a unique root class for our custom block to ensure style isolation */
.qianqian-custom-block {
    padding: 12px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Styles for the button */
.qianqian-custom-block button {
    padding: 8px 16px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f4f4f5;
    color: #606266;
    transition: all 0.2s ease-in-out; // Add a transition effect

    /* Use SCSS nesting to easily define the hover effect */
    &:hover {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        transform: translateY(-2px);
    }
}

```

**2. Write the Logic (****`src/index.ts`** **)** Next, let's handle the "functionality". Open the `src/index.ts` file and paste the entire code below into it.

```
// At the top of the file, import our stylesheet
// When Webpack sees this, it will automatically process style.scss
import './style.scss';

// Step 1: Clear the current block to prevent duplicate buttons upon script reload
this.innerHTML = '';

// Step 2: Apply the root class defined in our CSS to the block element
this.className = 'qianqian-custom-block';

// Step 3: Create a button element (no need to write styles in JS anymore)
const button = document.createElement('button');
button.textContent = 'Click Me for a Hint';

// Step 4: Define the action to be executed when the button is clicked
const showNotification = () => {
    fetch('/api/notification/pushMsg', {
        method: 'POST',
        body: JSON.stringify({
            msg: `Hello! This is a hint from block ID ${this.dataset.nodeId}.`,
            timeout: 5000,
        }),
    }).catch(error => console.error('Failed to send notification:', error));
};

// Step 5: Bind this action to the button's click event
button.addEventListener('click', showNotification);

// Step 6: Append the created button to the current block element
this.append(button);

// Step 7: Return a "cleanup function" to remove the event listener and prevent memory leaks
return () => {
    button.removeEventListener('click', showNotification);
    console.log('Hint button\'s event listener has been successfully cleaned up!');
};

```

### Step 4: Bundle Your Script

After writing the code, we need to "compile and bundle" it into the final product.

- **Build for production**:

  ```
  pnpm run build

  ```
- **Start development mode (Highly Recommended!)** :

  ```
  pnpm run dev

  ```

  After running this command, Webpack will continuously watch your `src` folder. Whenever you modify and **save** a file, it will automatically re-bundle in the background, saving you from running the command manually each time and greatly improving development efficiency!

After a successful execution, a `dist` folder will be generated in the project root, containing two files: `QianQian.js` and `QianQian.css`.

### Step 5: Witness the Magic in Siyuan Note

Now, let's apply our hard work to Siyuan Note!

1. **Get the Code**:

    - Open `dist/QianQian.js` with VS Code and copy **all of its content**.
    - Open `dist/QianQian.css` with VS Code and copy **all of its content**.
    - **Note:**  The `/* @webpack */` comment in the generated CSS file must also be copied.
2. In the Siyuan Note plugin marketplace, find and install the [QianQian Block](https://github.com/lovexmm521/siyuan-plugin-QianQiankuai "Love QianQian"). Then open the Custom Block JS settings.
3. **Create a Custom Block**: On any block in any document in Siyuan Note:

    1. Click the block icon to the left of the block you want to modify (e.g., the ¶ icon for a paragraph block).
    2. In the pop-up menu, select Plugins -\> "Custom Block CSS" or "Custom Block JS".
    3. Enter your code directly into the expanded editing area. The code will save and take effect in real-time.

    Of course, you can achieve the same effect by manually adding `css` or `js` custom attributes to the block.
4. **See the Result**: Once done, a beautiful button should immediately appear in your custom block! Hover your mouse over it to see the hover effect, then click it. Did a notification pop up in the center of the screen?

**Debugging Tip**: In Siyuan Note, press `Ctrl+Shift+I` (Windows) or `Cmd+Opt+I` (Mac) to open the "Developer Tools". In the `Console` tab, you can see the output from `console.log`, which is very helpful for finding code errors.

### Conclusion

Congratulations! You have successfully created and run your first interactive custom block.

Let's review our steps:

1. **Prepared the environment**: Installed Node.js, pnpm.
2. **Set up the project**: Created the folder and configured `package.json`, `webpack.config.js`, and `tsconfig.json`.
3. **Wrote the code**: Separately wrote `index.ts` (logic) and `style.scss` (presentation) in the `src` directory.
4. **Bundled the code**: Used `pnpm run build` or `pnpm run dev` to generate separate `JS` and `CSS` files.
5. **Applied and tested**: Pasted the script and styles into SiYuan's `custom-js` and `custom-css` block attributes, respectively.

This is just the beginning. With this powerful workflow, you can integrate any modern front-end technology (like data visualization libraries, complex UI components, etc.) into your SiYuan Note blocks. Unleash your creativity and build your own unique note-taking experience!




