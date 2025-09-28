Hello, future SiYuan Note creators!

Welcome to this beginner's guide tailored for Custom Blocks. This guide aims to help friends like you who want to create powerful interactive features in SiYuan Note but don't know where to start. I will take you from scratch, step by step, to set up a professional front-end development environment and ultimately create your own fully functional interactive custom block.

### [中文简体说明](https://github.com/lovexmm521/siyuan-custom-block-js/blob/main/README_zh_CN.md "null")

### Prologue: Prerequisites

Before you start coding, you need to ensure that the following tools are installed on your computer. These are the cornerstones of modern front-end development.

- **Node.js**: All our development is based on the Node.js environment. Please visit the [Node.js official website](https://nodejs.org/ "null") to download and install the latest LTS (Long-Term Support) version. After installation, the `npm` package manager will also be installed.
- **pnpm (recommended)** : This is a faster and more efficient package manager. After installing Node.js, run the following command in your terminal (Terminal or PowerShell) to install it:

  ```
  npm install -g pnpm

  ```
- **Code Editor**: **Visual Studio Code (VS Code)**  is highly recommended. It has excellent support for TypeScript and will greatly enhance your development experience.

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
├── src/              # All your source code will be placed here
│   └── modules/      # (Optional) For storing sub-modules of complex functions
│   └── index.ts      # The main entry file of the project (*we mainly write code here*)
├── package.json      # The project's package management file (already generated)
├── tsconfig.json     # TypeScript configuration file
└── webpack.config.js # Webpack bundling configuration file (*the "engine" of the project*)

```

**2. Populate Configuration Files**Next, copy and paste the configuration content we discussed and finalized earlier into the corresponding files. These files together form our powerful and stable development environment.

- **`package.json`**  **(Project Manifest and Scripts)** : Defines project dependencies and convenient commands like `build`/`dev`.
- **`webpack.config.js`**  **(Bundling Core)** : This is the "brain" of the entire workflow. It is responsible for intelligently converting our modular TypeScript code from `src` into a single JavaScript script that SiYuan Note can execute seamlessly.
- **`tsconfig.json`**  **(TS Compiler Config)** : Tells the TypeScript compiler how to check and compile our code.

**3. Install Dependencies**After configuring `package.json`, run the following command in the terminal. pnpm will automatically download and install all the development tools we need:

```
pnpm install

```

### Step 3: Write Your First Custom Block Feature

With the environment ready, let's create a simple interactive feature: **create a button inside the block that, when clicked, displays a notification from SiYuan's API containing the current block's ID.**

Open the `src/index.ts` file and paste the entire code below into it.

```
// Step 1: Clear the current block to prevent duplicate button creation on code reload
this.innerHTML = '';

// Step 2: Create a button element
const button = document.createElement('button');
button.textContent = 'Click me for a notification';

// Step 3 (Optional): Add some styles to the button to make it look nicer
button.style.padding = '8px 16px';
button.style.border = '1px solid #dcdfe6';
button.style.borderRadius = '4px';
button.style.cursor = 'pointer';
button.style.backgroundColor = '#f4f4f5';
button.style.color = '#606266';

// Step 4: Define the action to be performed when the button is clicked
const showNotification = () => {
    // Call SiYuan Note's built-in notification API
    fetch('/api/notification/pushMsg', {
        method: 'POST',
        body: JSON.stringify({
            msg: `Hello! This is a notification from block ID ${this.dataset.nodeId}.`,
            timeout: 5000, // Message displays for 5 seconds
        }),
    }).catch(error => console.error('Failed to send notification:', error));
};

// Step 5: Bind this action to the button's click event
button.addEventListener('click', showNotification);

// Step 6: Add the created button to the current block element
this.append(button);

// Step 7: Return a "cleanup function"
// This is a crucial step in custom block development.
// SiYuan will automatically call this function when the block is deleted or the code is updated.
return () => {
    // Here, we need to remove the event listener we previously added to prevent memory leaks
    button.removeEventListener('click', showNotification);
    console.log('Notification button\'s event listener has been successfully cleaned up!');
};

```

**Key Concepts**:

- **`this`** **keyword**: At the top level of `src/index.ts`, `this` represents the `div` element of the current custom block, and we can manipulate it directly.
- **`this.innerHTML = ''`** : This is key to ensuring the script can be re-executed, preventing the repeated creation of UI elements.
- **`return () =&gt; { ... }`** : This is key to ensuring SiYuan Note's performance. The returned "cleanup function" will be executed automatically when the block is destroyed. We must "clean up the scene" here, such as removing event listeners, clearing timers, etc.

### Step 4: Bundle Your Script

After writing the code, we need to "compile and bundle" it into the final JS code.

- **Build for production**:

  ```
  pnpm run build

  ```
- **Start development mode (Recommended!)** :

  ```
  pnpm run dev

  ```

  After running this command, Webpack will continuously monitor your `src` folder. Whenever you modify and **save** a file, it will automatically rebundle in the background, saving you from manually running the command each time and greatly improving development efficiency!

After successful execution, a `dist` folder will be generated in the project's root directory, containing a `QianQian.js` file (named according to your configuration). This is our final product!

### Step 5: Witness the Magic in SiYuan Note

Now, let's apply our hard work to SiYuan Note!

1. **Get the code**: Open the `dist/QianQian.js` file with VS Code and copy its **entire content**.
2. **Create a custom block**: In any document in SiYuan Note, type `/` to bring up the menu and select "Custom JS Block".
3. **Paste the code**:

    - Click the `···` menu in the upper right corner of the newly created block and select "Block Attributes".
    - In the attributes panel, find the attribute named `custom-js`.
    - Paste **all the code** you just copied into the `custom-js` input box, then press Enter to confirm.
4. **See the effect**: After pasting, a "Click me for a notification" button should immediately appear in your custom block! Try clicking it. Did a notification with the block ID pop up in the center of the screen?

**Debugging Tip**: In SiYuan Note, you can press `Ctrl+Shift+I` (Windows) or `Cmd+Opt+I` (Mac) to open the "Developer Tools". In the `Console` tab, you can see the output of `console.log`, which is very helpful for finding code errors.

### Summary

Congratulations! You have successfully created and run your first interactive custom block.

Let's review our steps:

1. **Prepare the environment**: Install Node.js, pnpm.
2. **Set up the project**: Create a folder and configure `package.json`, `webpack.config.js`, and `tsconfig.json`.
3. **Write the code**: Implemented the full logic of creating a button, binding an event, and returning a cleanup function in `src/index.ts`.
4. **Bundle and build**: Use `pnpm run build` or `pnpm run dev` to generate the final JS script.
5. **Apply and test**: Paste the script into the `custom-js` block attribute in SiYuan and check the effect.


This is just the beginning. With this powerful workflow, you can integrate any modern front-end technology (like data visualization libraries, complex UI components, etc.) into your SiYuan Note blocks. Unleash your creativity to build your own unique note-taking experience!



