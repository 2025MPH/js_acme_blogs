//Refer to Final Project Discussion PDF along with the requirements when checking the code.
//Refer to JS Project Cheatsheet when required
//Stay away from the HTML and CSS files!


//***********************************************************************Part 1: createElemWithText function***********************************************************************


function createElemWithText(elementName = 'p', textContent = '', className) {
    const element = document.createElement(elementName);
    element.textContent = textContent;
    if (className) {
        element.className = className;
    }
    return element;
}

//***********************************************************************Part 2: createElemWithText function***********************************************************************

function createSelectOptions(users) {
    if (!users) {
        return undefined;
    }

    const options = [];
    for (const user of users) {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        options.push(option);
    }

    return options;
}

//***********************************************************************Part 3: toggleCommentSection function***********************************************************************


function toggleCommentSection(postId) {
    if (postId === undefined) {
        return undefined;
    }

    const section = document.querySelector(`section[data-post-id="${postId}"]`);
    if (section) {
        section.classList.toggle('hide');
    }
    return section;
}

//***********************************************************************Part 4: toggleCommentButton function***********************************************************************

function toggleCommentButton(postId) {
    if (postId === undefined) {
        return undefined;
    }

    const button = document.querySelector(`button[data-post-id="${postId}"]`);
    if (button) {
        button.textContent = button.textContent === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
    }
    return button;
}


//***********************************************************************Part 5: deleteChildElements function***********************************************************************

function deleteChildElements(parentElement) {
    if (!(parentElement instanceof Element)) {
        return undefined;
    }

    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }

    return parentElement;
}

//******************************************************************************************************************************************************************************

//The above functions had no dependency on other functions.They were very self - contained which is ideal.
//That is not always possible though.We will try to limit dependencies as we go.The next several functions have small dependencies.


//***********************************************************************Part 6: addButtonListeners function***********************************************************************
//Refer to cheatsheet

function addButtonListeners() {
    const mainElement = document.querySelector('main');

    if (!mainElement) {
        return document.querySelectorAll([]);
    }

    const buttons = mainElement.querySelectorAll('button');

    if (buttons.length > 0) {
        buttons.forEach(button => {
            const postId = button.dataset.postId;

            if (postId) {
                button.addEventListener('click', (event) => {
                    toggleComments(event, postId);
                });
            }
        });
    }

    return buttons;
}


//***********************************************************************Part 7: removeButtonListeners function***********************************************************************

function removeButtonListeners() {
    const mainElement = document.querySelector('main');

    if (!mainElement) {
        return document.querySelectorAll([]);
    }

    const buttons = mainElement.querySelectorAll('button');

    buttons.forEach(button => {
        const clickListeners = button._eventListeners && button._eventListeners.click;
        if (clickListeners) {
            clickListeners.forEach(listener => {
                button.removeEventListener('click', listener);
            });
        }
    });

    return buttons;
}


//***********************************************************************Part 8: createComments function***********************************************************************
//Depends on the createElemWithText function we created
//Refer to cheatsheet

function createComments(commentsData) {
    if (!commentsData) {
        return undefined;
    }

    const fragment = document.createDocumentFragment();

    commentsData.forEach(comment => {
        const article = document.createElement('article');
        const h3 = document.createElement('h3');
        const bodyParagraph = document.createElement('p');
        const emailParagraph = document.createElement('p');

        h3.textContent = comment.name;
        bodyParagraph.textContent = comment.body;
        emailParagraph.textContent = `From: ${comment.email}`;

        article.appendChild(h3);
        article.appendChild(bodyParagraph);
        article.appendChild(emailParagraph);

        fragment.appendChild(article);
    });

    return fragment;
}
//***********************************************************************Part 9: populateSelectMenu function***********************************************************************
//Depends on the createSelectOptions function we created

function populateSelectMenu(usersData) {
    if (!usersData) {
        return undefined;
    }

    const selectMenu = document.getElementById('selectMenu');
    const optionElements = createSelectOptions(usersData);

    optionElements.forEach(option => {
        selectMenu.appendChild(option);
    });

    return selectMenu;
}

//***********************************************************************Part 10: getUsers function***********************************************************************

const getUsers = async () => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await response.json();
        return users;
    } catch (err) {
        console.error(err);
    }
};

//***********************************************************************Part 11: getUserPosts function***********************************************************************

const getUserPosts = async (userID) => {
    if (!userID) {
        return;
    }
    try {
        const usersPosts = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}/posts`);
        return await usersPosts.json();
    } catch (err) {
        console.error(err);
    }
}
//***********************************************************************Part 12: getUser function***********************************************************************

const getUser = async (userID) => {
    if (!userID) {
        return;
    }
    try {
        const user = await fetch(`https://jsonplaceholder.typicode.com/users/${userID}/`);
        return await user.json();
    } catch (err) {
        console.error(err);
    }
}


//******************************************************************************************************************************************************************************

//The next functions will depend on the async API data functions we just created.
//Therefore, these functions will also need to be async.When they call the API functions, they will need to await data from those functions.

//***********************************************************************Part 13: getPostComments function***********************************************************************

const getPostComments = async (postID) => {
    if (!postID) {
        return;
    }
    try {
        const comments = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postID}`);
        return await comments.json();
    } catch (err) {
        console.error(err);
    }
}
//***********************************************************************Part 14: displayComments function***********************************************************************
//Dependencies: getPostComments, createComments

const displayComments = async (postId) => {
    if (!postId) {
        return;
    }
    let section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    let comments = await getPostComments(postId);
    let fragment = createComments(comments);
    section.append(fragment);
    return section;
}
//***********************************************************************Part 15: createPosts function***********************************************************************
//Dependencies: createElemWithText, getUser, displayComments

const createPosts = async jsonData => {
    if (!jsonData) return;
    const fragment = document.createDocumentFragment();
    for (const post of jsonData) {
        const article = document.createElement('article');
        const h2 = document.createElement('h2');
        h2.textContent = post.title;
        const p1 = document.createElement('p');
        p1.textContent = post.body;
        const p2 = document.createElement('p');
        p2.textContent = `Post ID: ${post.id}`;
        const author = await getUser(post.userId);
        const p3 = document.createElement('p');
        p3.textContent = `Author: ${author.name} with ${author.company.name}`;
        const p4 = document.createElement('p');
        p4.textContent = author.company.catchPhrase;
        const button = document.createElement('button');
        button.textContent = 'Show Comments';
        button.dataset.postId = post.id;
        article.append(h2, p1, p2, p3, p4, button);
        const section = await displayComments(post.id);
        article.append(section);
        fragment.append(article);
    }
    return fragment;
}
//***********************************************************************Part 16: displayPosts function***********************************************************************
//Dependencies: createPosts, createElemWithText

const displayPosts = async (posts) => {
    let main = document.querySelector('main');
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    main.append(element);
    return element;
}
//***********************************************************************Part 17: toggleComments function***********************************************************************
//Dependencies: toggleCommentSection, toggleCommentButton

function toggleComments(event, postId) {
    if (!event || postId === undefined) {
        return undefined;
    }

    event.target.listener = true;

    const section = toggleCommentSection(postId);
    const button = toggleCommentButton(postId);
    return [section, button];
}
//***********************************************************************Part 18: refreshPosts function***********************************************************************
//Dependencies: removeButtonListeners, deleteChildElements, displayPosts, addButtonListeners

const refreshPosts = async (posts) => {
    if (!posts) {
        return;
    }
    let buttons = removeButtonListeners();
    let main = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    return [buttons, main, fragment, button];
}
//***********************************************************************Part 19: selectMenuChangeEventHandler function***********************************************************************  
//Dependencies: getUserPosts, refreshPosts
//Refer to cheatsheet

const selectMenuChangeEventHandler = async (e) => {
    if (!e) {
        return;
    }
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}
//***********************************************************************Part 20: initPage function***********************************************************************
//Dependencies: getUsers, populateSelectMenu

const initPage = async () => {
    const users = await getUsers();
    const select = populateSelectMenu(users);
    return [users, select];
};
//***********************************************************************Part 21: initApp function**********************************************************************
//Dependencies: initPage, selectMenuChangeEventHandler

function initApp() {
    initPage();
    const select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}

//**********************************************************************************************************************************************************************

//*** This must be underneath the definition of initApp in your file.
//1. Add an event listener to the document.
//2. Listen for the �DOMContentLoaded� event.
//3. Put initApp in the listener as the event handler function.
//4. This will call initApp after the DOM content has loaded and your app will be started.


document.addEventListener("DOMContentLoaded", initApp, false);